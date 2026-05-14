# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyProfile*](#getmyprofile)
  - [*ListPublicWorkoutRoutines*](#listpublicworkoutroutines)
- [**Mutations**](#mutations)
  - [*CreateExercise*](#createexercise)
  - [*LogWorkoutSession*](#logworkoutsession)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMyProfile
You can execute the `GetMyProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyProfileRef:
```typescript
const name = getMyProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyProfile` query has no variables.
### Return Type
Recall that executing the `GetMyProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyProfileData {
  user?: {
    id: UUIDString;
    displayName: string;
    email?: string | null;
    goal: string;
    height?: number | null;
    weight?: number | null;
    photoUrl?: string | null;
    createdAt: TimestampString;
  } & User_Key;
}
```
### Using `GetMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyProfile } from '@dataconnect/generated';


// Call the `getMyProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMyProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMyProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyProfileRef } from '@dataconnect/generated';


// Call the `getMyProfileRef()` function to get a reference to the query.
const ref = getMyProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListPublicWorkoutRoutines
You can execute the `ListPublicWorkoutRoutines` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublicWorkoutRoutines(options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkoutRoutinesData, undefined>;

interface ListPublicWorkoutRoutinesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicWorkoutRoutinesData, undefined>;
}
export const listPublicWorkoutRoutinesRef: ListPublicWorkoutRoutinesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicWorkoutRoutines(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkoutRoutinesData, undefined>;

interface ListPublicWorkoutRoutinesRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicWorkoutRoutinesData, undefined>;
}
export const listPublicWorkoutRoutinesRef: ListPublicWorkoutRoutinesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicWorkoutRoutinesRef:
```typescript
const name = listPublicWorkoutRoutinesRef.operationName;
console.log(name);
```

### Variables
The `ListPublicWorkoutRoutines` query has no variables.
### Return Type
Recall that executing the `ListPublicWorkoutRoutines` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicWorkoutRoutinesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublicWorkoutRoutinesData {
  workoutRoutines: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    user: {
      displayName: string;
    };
      createdAt: TimestampString;
  } & WorkoutRoutine_Key)[];
}
```
### Using `ListPublicWorkoutRoutines`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicWorkoutRoutines } from '@dataconnect/generated';


// Call the `listPublicWorkoutRoutines()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicWorkoutRoutines();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicWorkoutRoutines(dataConnect);

console.log(data.workoutRoutines);

// Or, you can use the `Promise` API.
listPublicWorkoutRoutines().then((response) => {
  const data = response.data;
  console.log(data.workoutRoutines);
});
```

### Using `ListPublicWorkoutRoutines`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicWorkoutRoutinesRef } from '@dataconnect/generated';


// Call the `listPublicWorkoutRoutinesRef()` function to get a reference to the query.
const ref = listPublicWorkoutRoutinesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicWorkoutRoutinesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workoutRoutines);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workoutRoutines);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateExercise
You can execute the `CreateExercise` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createExercise(vars: CreateExerciseVariables): MutationPromise<CreateExerciseData, CreateExerciseVariables>;

interface CreateExerciseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateExerciseVariables): MutationRef<CreateExerciseData, CreateExerciseVariables>;
}
export const createExerciseRef: CreateExerciseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createExercise(dc: DataConnect, vars: CreateExerciseVariables): MutationPromise<CreateExerciseData, CreateExerciseVariables>;

interface CreateExerciseRef {
  ...
  (dc: DataConnect, vars: CreateExerciseVariables): MutationRef<CreateExerciseData, CreateExerciseVariables>;
}
export const createExerciseRef: CreateExerciseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createExerciseRef:
```typescript
const name = createExerciseRef.operationName;
console.log(name);
```

### Variables
The `CreateExercise` mutation requires an argument of type `CreateExerciseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateExerciseVariables {
  name: string;
  description?: string | null;
  instructions?: string | null;
  muscleGroup?: string | null;
}
```
### Return Type
Recall that executing the `CreateExercise` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateExerciseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateExerciseData {
  exercise_insert: Exercise_Key;
}
```
### Using `CreateExercise`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createExercise, CreateExerciseVariables } from '@dataconnect/generated';

// The `CreateExercise` mutation requires an argument of type `CreateExerciseVariables`:
const createExerciseVars: CreateExerciseVariables = {
  name: ..., 
  description: ..., // optional
  instructions: ..., // optional
  muscleGroup: ..., // optional
};

// Call the `createExercise()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createExercise(createExerciseVars);
// Variables can be defined inline as well.
const { data } = await createExercise({ name: ..., description: ..., instructions: ..., muscleGroup: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createExercise(dataConnect, createExerciseVars);

console.log(data.exercise_insert);

// Or, you can use the `Promise` API.
createExercise(createExerciseVars).then((response) => {
  const data = response.data;
  console.log(data.exercise_insert);
});
```

### Using `CreateExercise`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createExerciseRef, CreateExerciseVariables } from '@dataconnect/generated';

// The `CreateExercise` mutation requires an argument of type `CreateExerciseVariables`:
const createExerciseVars: CreateExerciseVariables = {
  name: ..., 
  description: ..., // optional
  instructions: ..., // optional
  muscleGroup: ..., // optional
};

// Call the `createExerciseRef()` function to get a reference to the mutation.
const ref = createExerciseRef(createExerciseVars);
// Variables can be defined inline as well.
const ref = createExerciseRef({ name: ..., description: ..., instructions: ..., muscleGroup: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createExerciseRef(dataConnect, createExerciseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.exercise_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.exercise_insert);
});
```

## LogWorkoutSession
You can execute the `LogWorkoutSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
logWorkoutSession(vars: LogWorkoutSessionVariables): MutationPromise<LogWorkoutSessionData, LogWorkoutSessionVariables>;

interface LogWorkoutSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogWorkoutSessionVariables): MutationRef<LogWorkoutSessionData, LogWorkoutSessionVariables>;
}
export const logWorkoutSessionRef: LogWorkoutSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logWorkoutSession(dc: DataConnect, vars: LogWorkoutSessionVariables): MutationPromise<LogWorkoutSessionData, LogWorkoutSessionVariables>;

interface LogWorkoutSessionRef {
  ...
  (dc: DataConnect, vars: LogWorkoutSessionVariables): MutationRef<LogWorkoutSessionData, LogWorkoutSessionVariables>;
}
export const logWorkoutSessionRef: LogWorkoutSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logWorkoutSessionRef:
```typescript
const name = logWorkoutSessionRef.operationName;
console.log(name);
```

### Variables
The `LogWorkoutSession` mutation requires an argument of type `LogWorkoutSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogWorkoutSessionVariables {
  workoutDate: DateString;
  workoutRoutineId?: UUIDString | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `LogWorkoutSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogWorkoutSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogWorkoutSessionData {
  workoutSession_insert: WorkoutSession_Key;
}
```
### Using `LogWorkoutSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logWorkoutSession, LogWorkoutSessionVariables } from '@dataconnect/generated';

// The `LogWorkoutSession` mutation requires an argument of type `LogWorkoutSessionVariables`:
const logWorkoutSessionVars: LogWorkoutSessionVariables = {
  workoutDate: ..., 
  workoutRoutineId: ..., // optional
  notes: ..., // optional
};

// Call the `logWorkoutSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logWorkoutSession(logWorkoutSessionVars);
// Variables can be defined inline as well.
const { data } = await logWorkoutSession({ workoutDate: ..., workoutRoutineId: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logWorkoutSession(dataConnect, logWorkoutSessionVars);

console.log(data.workoutSession_insert);

// Or, you can use the `Promise` API.
logWorkoutSession(logWorkoutSessionVars).then((response) => {
  const data = response.data;
  console.log(data.workoutSession_insert);
});
```

### Using `LogWorkoutSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logWorkoutSessionRef, LogWorkoutSessionVariables } from '@dataconnect/generated';

// The `LogWorkoutSession` mutation requires an argument of type `LogWorkoutSessionVariables`:
const logWorkoutSessionVars: LogWorkoutSessionVariables = {
  workoutDate: ..., 
  workoutRoutineId: ..., // optional
  notes: ..., // optional
};

// Call the `logWorkoutSessionRef()` function to get a reference to the mutation.
const ref = logWorkoutSessionRef(logWorkoutSessionVars);
// Variables can be defined inline as well.
const ref = logWorkoutSessionRef({ workoutDate: ..., workoutRoutineId: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logWorkoutSessionRef(dataConnect, logWorkoutSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workoutSession_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workoutSession_insert);
});
```

