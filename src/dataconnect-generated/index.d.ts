import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateExerciseData {
  exercise_insert: Exercise_Key;
}

export interface CreateExerciseVariables {
  name: string;
  description?: string | null;
  instructions?: string | null;
  muscleGroup?: string | null;
}

export interface ExercisePerformance_Key {
  id: UUIDString;
  __typename?: 'ExercisePerformance_Key';
}

export interface Exercise_Key {
  id: UUIDString;
  __typename?: 'Exercise_Key';
}

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

export interface LogWorkoutSessionData {
  workoutSession_insert: WorkoutSession_Key;
}

export interface LogWorkoutSessionVariables {
  workoutDate: DateString;
  workoutRoutineId?: UUIDString | null;
  notes?: string | null;
}

export interface RoutineExercise_Key {
  id: UUIDString;
  __typename?: 'RoutineExercise_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface WorkoutRoutine_Key {
  id: UUIDString;
  __typename?: 'WorkoutRoutine_Key';
}

export interface WorkoutSession_Key {
  id: UUIDString;
  __typename?: 'WorkoutSession_Key';
}

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface CreateExerciseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateExerciseVariables): MutationRef<CreateExerciseData, CreateExerciseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateExerciseVariables): MutationRef<CreateExerciseData, CreateExerciseVariables>;
  operationName: string;
}
export const createExerciseRef: CreateExerciseRef;

export function createExercise(vars: CreateExerciseVariables): MutationPromise<CreateExerciseData, CreateExerciseVariables>;
export function createExercise(dc: DataConnect, vars: CreateExerciseVariables): MutationPromise<CreateExerciseData, CreateExerciseVariables>;

interface ListPublicWorkoutRoutinesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicWorkoutRoutinesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicWorkoutRoutinesData, undefined>;
  operationName: string;
}
export const listPublicWorkoutRoutinesRef: ListPublicWorkoutRoutinesRef;

export function listPublicWorkoutRoutines(options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkoutRoutinesData, undefined>;
export function listPublicWorkoutRoutines(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublicWorkoutRoutinesData, undefined>;

interface LogWorkoutSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogWorkoutSessionVariables): MutationRef<LogWorkoutSessionData, LogWorkoutSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogWorkoutSessionVariables): MutationRef<LogWorkoutSessionData, LogWorkoutSessionVariables>;
  operationName: string;
}
export const logWorkoutSessionRef: LogWorkoutSessionRef;

export function logWorkoutSession(vars: LogWorkoutSessionVariables): MutationPromise<LogWorkoutSessionData, LogWorkoutSessionVariables>;
export function logWorkoutSession(dc: DataConnect, vars: LogWorkoutSessionVariables): MutationPromise<LogWorkoutSessionData, LogWorkoutSessionVariables>;

