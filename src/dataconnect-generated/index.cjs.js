const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'genealogy-connect',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';
exports.getMyProfileRef = getMyProfileRef;

exports.getMyProfile = function getMyProfile(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyProfileRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createExerciseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateExercise', inputVars);
}
createExerciseRef.operationName = 'CreateExercise';
exports.createExerciseRef = createExerciseRef;

exports.createExercise = function createExercise(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createExerciseRef(dcInstance, inputVars));
}
;

const listPublicWorkoutRoutinesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicWorkoutRoutines');
}
listPublicWorkoutRoutinesRef.operationName = 'ListPublicWorkoutRoutines';
exports.listPublicWorkoutRoutinesRef = listPublicWorkoutRoutinesRef;

exports.listPublicWorkoutRoutines = function listPublicWorkoutRoutines(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPublicWorkoutRoutinesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const logWorkoutSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LogWorkoutSession', inputVars);
}
logWorkoutSessionRef.operationName = 'LogWorkoutSession';
exports.logWorkoutSessionRef = logWorkoutSessionRef;

exports.logWorkoutSession = function logWorkoutSession(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(logWorkoutSessionRef(dcInstance, inputVars));
}
;
