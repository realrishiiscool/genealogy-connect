import { GetMyProfileData, CreateExerciseData, CreateExerciseVariables, ListPublicWorkoutRoutinesData, LogWorkoutSessionData, LogWorkoutSessionVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useGetMyProfile(options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
export function useGetMyProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;

export function useCreateExercise(options?: useDataConnectMutationOptions<CreateExerciseData, FirebaseError, CreateExerciseVariables>): UseDataConnectMutationResult<CreateExerciseData, CreateExerciseVariables>;
export function useCreateExercise(dc: DataConnect, options?: useDataConnectMutationOptions<CreateExerciseData, FirebaseError, CreateExerciseVariables>): UseDataConnectMutationResult<CreateExerciseData, CreateExerciseVariables>;

export function useListPublicWorkoutRoutines(options?: useDataConnectQueryOptions<ListPublicWorkoutRoutinesData>): UseDataConnectQueryResult<ListPublicWorkoutRoutinesData, undefined>;
export function useListPublicWorkoutRoutines(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicWorkoutRoutinesData>): UseDataConnectQueryResult<ListPublicWorkoutRoutinesData, undefined>;

export function useLogWorkoutSession(options?: useDataConnectMutationOptions<LogWorkoutSessionData, FirebaseError, LogWorkoutSessionVariables>): UseDataConnectMutationResult<LogWorkoutSessionData, LogWorkoutSessionVariables>;
export function useLogWorkoutSession(dc: DataConnect, options?: useDataConnectMutationOptions<LogWorkoutSessionData, FirebaseError, LogWorkoutSessionVariables>): UseDataConnectMutationResult<LogWorkoutSessionData, LogWorkoutSessionVariables>;
