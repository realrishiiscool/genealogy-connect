import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'genealogy-connect',
  location: 'us-east4'
};
export const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
export const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';

export function getMyProfile(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyProfileRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createExerciseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateExercise', inputVars);
}
createExerciseRef.operationName = 'CreateExercise';

export function createExercise(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createExerciseRef(dcInstance, inputVars));
}

export const listPublicWorkoutRoutinesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicWorkoutRoutines');
}
listPublicWorkoutRoutinesRef.operationName = 'ListPublicWorkoutRoutines';

export function listPublicWorkoutRoutines(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPublicWorkoutRoutinesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const logWorkoutSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LogWorkoutSession', inputVars);
}
logWorkoutSessionRef.operationName = 'LogWorkoutSession';

export function logWorkoutSession(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(logWorkoutSessionRef(dcInstance, inputVars));
}

