import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { config } from 'dotenv';
config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secret-key";
const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "genealogy_connect"
};

const getDB = () => mysql.createConnection(dbConfig);

app.get('/', (req, res) => res.send('MySQL Direct API is running'));

// Register
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email: emailInput, password, mobile, userType, referralCodeInput, boutiqueName } = req.body;
  try {
    const db = await getDB();
    
    // Check if mobile already exists
    const [existingMobile] = await db.execute('SELECT id FROM users WHERE mobile = ?', [mobile]);
    if (existingMobile.length > 0) return res.status(400).json({ error: 'Mobile number already registered' });

    // Use provided email or generate one from mobile
    const email = emailInput || `${mobile.replace(/\D/g, '')}@boutify.app`;
    
    const [existingEmail] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0 && emailInput) return res.status(400).json({ error: 'Email already exists' });

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    // Generate an 8-character referral code
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const status = userType === 'admin' ? 'active' : 'pending';

    let referredBy = null;
    if (referralCodeInput) {
      const [referrer] = await db.execute('SELECT id FROM users WHERE referral_code = ?', [referralCodeInput.toUpperCase()]);
      if (referrer.length > 0) {
        referredBy = referrer[0].id;
      } else {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
    }

    await db.execute(
      'INSERT INTO users (id, full_name, email, password_hash, mobile, user_type, status, referral_code, referred_by, boutique_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, fullName, email, passwordHash, mobile, userType, status, referralCode, referredBy, boutiqueName]
    );
    await db.end();
    res.json({ message: 'Registered successfully', referralCode });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const db = await getDB();
    // Try login by mobile first, then by email if mobile is not found
    let [rows] = await db.execute('SELECT * FROM users WHERE mobile = ?', [mobile]);
    
    if (rows.length === 0) {
      // Fallback to email just in case
      [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [mobile]);
    }
    
    await db.end();
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '24h' });
    
    // Don't send password hash
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Me
app.get('/api/auth/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = await getDB();
    const [rows] = await db.execute('SELECT id, full_name, email, mobile, user_type, status, referral_code, boutique_name, created_at FROM users WHERE id = ?', [decoded.sub]);
    await db.end();
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Admin
app.get('/api/users', async (req, res) => {
    try {
        const db = await getDB();
        const [rows] = await db.execute('SELECT id, full_name, email, mobile, user_type, status, referral_code, created_at FROM users ORDER BY created_at DESC');
        await db.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/users/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const db = await getDB();
        await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);
        await db.end();
        res.json({ message: 'Updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const db = await getDB();
        await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        await db.end();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/auth/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub;
    const body = req.body;
    const db = await getDB();
    const allowedFields = ['full_name', 'boutique_name', 'mobile'];
    const updates = Object.keys(body).filter(key => allowedFields.includes(key)).map(key => `${key} = ?`).join(', ');
    if (!updates) return res.status(400).json({ error: 'No fields' });
    const values = Object.keys(body).filter(key => allowedFields.includes(key)).map(key => body[key]);
    values.push(userId);
    await db.execute(`UPDATE users SET ${updates} WHERE id = ?`, values);
    await db.end();
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats (Simple version for direct API)
app.get('/api/dashboard/stats', async (req, res) => {
    const { userId, role } = req.query;
    try {
        const db = await getDB();
        const [allUsers] = await db.execute('SELECT * FROM users');
        
        let directCount = 0;
        let networkCount = 0;
        let sponsorName = null;

        if (userId) {
            // Count direct referrals
            const [directs] = await db.execute('SELECT id FROM users WHERE referred_by = ?', [userId]);
            directCount = directs.length;

            // Recursive network count
            const getDownlineCount = async (ids) => {
                if (ids.length === 0) return 0;
                const [downline] = await db.execute(`SELECT id FROM users WHERE referred_by IN (${ids.map(() => '?').join(',')})`, ids);
                if (downline.length === 0) return 0;
                const childIds = downline.map(d => d.id);
                return downline.length + await getDownlineCount(childIds);
            };

            if (directCount > 0) {
                const directIds = directs.map(d => d.id);
                networkCount = directCount + await getDownlineCount(directIds);
            }

            // Get sponsor name and boutique name
            const [userRows] = await db.execute('SELECT referred_by FROM users WHERE id = ?', [userId]);
            if (userRows.length > 0 && userRows[0].referred_by) {
                const [sponsorRows] = await db.execute('SELECT full_name, boutique_name FROM users WHERE id = ?', [userRows[0].referred_by]);
                if (sponsorRows.length > 0) {
                    sponsorName = sponsorRows[0].boutique_name ? `${sponsorRows[0].full_name} (${sponsorRows[0].boutique_name})` : sponsorRows[0].full_name;
                }
            }
        }

        await db.end();
        res.json({
            usersCount: allUsers.length,
            customersCount: allUsers.filter(u => u.user_type === 'customer').length,
            ownersCount: allUsers.filter(u => u.user_type === 'boutique_owner').length,
            referralsCount: allUsers.filter(u => u.referred_by).length,
            pendingCount: allUsers.filter(u => u.status === 'pending').length,
            activeCount: allUsers.filter(u => u.status === 'active').length,
            directCount,
            networkCount,
            sponsorName,
            allUsers: allUsers.map(u => {
                const { password_hash, ...safe } = u;
                return safe;
            })
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('MySQL Direct API listening on port 3000'));
