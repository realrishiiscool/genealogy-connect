import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

type Bindings = {
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// Database connection helper
const getDB = async (env: Bindings) => {
  return await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  });
};

app.get('/', (c) => c.text('Genealogy API is running'));

// --- Authentication ---

// Register
app.post('/api/auth/register', async (c) => {
  const { fullName, email, password, mobile, userType, referralCodeInput, boutiqueName } = await c.req.json();
  const db = await getDB(c.env);

  try {
    // Check if email exists
    const [existing]: any = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Status: active for admin, pending for others
    const status = userType === 'admin' ? 'active' : 'pending';

    // Handle referral
    let referredBy = null;
    if (userType === 'customer' && referralCodeInput) {
      const [referrer]: any = await db.execute('SELECT id FROM users WHERE referral_code = ?', [referralCodeInput.toUpperCase()]);
      if (referrer.length > 0) {
        referredBy = referrer[0].id;
      }
    }

    await db.execute(
      'INSERT INTO users (id, full_name, email, password_hash, mobile, user_type, status, referral_code, referred_by, boutique_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, fullName, email, passwordHash, mobile, userType, status, referralCode, referredBy, boutiqueName]
    );

    return c.json({ message: 'User registered successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  } finally {
    await db.end();
  }
});

// Login
app.post('/api/auth/login', async (c) => {
  const { mobile, password } = await c.req.json();
  const db = await getDB(c.env);
  
  // Login by mobile (as per current app) or email
  // App seems to use email generated from mobile: mobile@boutify.app
  const email = `${mobile.replace(/\D/g, '')}@boutify.app`;

  try {
    const [rows]: any = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const payload = {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
    };
    
    // We use @ts-ignore because Hono's jwt signature might be picky with types
    // @ts-ignore
    const token = await jwt.sign(payload, c.env.JWT_SECRET);

    return c.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        user_type: user.user_type,
        status: user.status,
        referral_code: user.referral_code,
        boutique_name: user.boutique_name,
        created_at: user.created_at
      }
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  } finally {
    await db.end();
  }
});

// Get Profile
app.get('/api/auth/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = await jwt.verify(token, c.env.JWT_SECRET);
    const userId = payload.sub;

    const db = await getDB(c.env);
    const [rows]: any = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    await db.end();

    if (rows.length === 0) return c.json({ error: 'User not found' }, 404);

    const user = rows[0];
    return c.json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      mobile: user.mobile,
      user_type: user.user_type,
      status: user.status,
      referral_code: user.referral_code,
      boutique_name: user.boutique_name,
      created_at: user.created_at
    });
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

app.patch('/api/auth/profile', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const payload = await jwt.verify(token, c.env.JWT_SECRET);
    const userId = payload.sub;
    const body = await c.req.json();
    
    const db = await getDB(c.env);
    
    // We only allow updating certain fields
    const allowedFields = ['full_name', 'boutique_name', 'mobile'];
    const updates = Object.keys(body)
      .filter(key => allowedFields.includes(key))
      .map(key => `${key} = ?`)
      .join(', ');
    
    if (!updates) return c.json({ error: 'No valid fields provided' }, 400);
    
    const values = Object.keys(body)
      .filter(key => allowedFields.includes(key))
      .map(key => body[key]);
    
    values.push(userId);
    
    await db.execute(`UPDATE users SET ${updates} WHERE id = ?`, values);
    await db.end();
    
    return c.json({ message: 'Profile updated' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// --- Admin ---

// List Users
app.get('/api/users', async (c) => {
  const db = await getDB(c.env);
  try {
    const [rows]: any = await db.execute('SELECT id, full_name, email, mobile, user_type, status, referral_code, created_at FROM users ORDER BY created_at DESC');
    return c.json(rows);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  } finally {
    await db.end();
  }
});

// Update Status
app.patch('/api/users/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status } = await c.req.json();
  const db = await getDB(c.env);
  try {
    await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    return c.json({ message: 'Status updated' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  } finally {
    await db.end();
  }
});

// Delete User
app.delete('/api/users/:id', async (c) => {
  const id = c.req.param('id');
  const db = await getDB(c.env);
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return c.json({ message: 'User deleted' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  } finally {
    await db.end();
  }
});

// --- Dashboard Stats ---
app.get('/api/dashboard/stats', async (c) => {
  const userId = c.req.query('userId');
  const role = c.req.query('role');
  const db = await getDB(c.env);
  
  try {
    const [allUsers]: any = await db.execute('SELECT * FROM users');
    
    const customers = allUsers.filter((u: any) => u.user_type === 'customer');
    const owners = allUsers.filter((u: any) => u.user_type === 'boutique_owner');
    const pending = allUsers.filter((u: any) => u.status === 'pending').length;
    const active = allUsers.filter((u: any) => u.status === 'active').length;
    const referrals = customers.filter((u: any) => u.referred_by).length;

    let direct = 0, network = 0;
    if (role === 'customer' && userId) {
      const map = new Map<string, string[]>();
      customers.forEach((c: any) => {
        if (c.referred_by) {
          if (!map.has(c.referred_by)) map.set(c.referred_by, []);
          map.get(c.referred_by)!.push(c.id);
        }
      });
      
      const queue = [{ id: userId, depth: 0 }];
      const visited = new Set<string>();
      while (queue.length) {
        const curr = queue.shift()!;
        for (const ch of map.get(curr.id) ?? []) {
          if (visited.has(ch)) continue;
          visited.add(ch);
          if (curr.depth + 1 < 3) {
            queue.push({ id: ch, depth: curr.depth + 1 });
          }
          if (curr.id === userId) direct++;
        }
      }
      network = visited.size;
    }

    return c.json({
      usersCount: allUsers.length,
      customersCount: customers.length,
      ownersCount: owners.length,
      referralsCount: referrals,
      pendingCount: pending,
      activeCount: active,
      directCount: direct,
      networkCount: network,
      allUsers // For charts if needed
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  } finally {
    await db.end();
  }
});

export default app;
