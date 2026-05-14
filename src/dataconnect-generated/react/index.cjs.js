const { getMyProfileRef, createExerciseRef, listPublicWorkoutRoutinesRef, logWorkoutSessionRef, connectorConfig } = require('../index.cjs.js');
const { validateArgs, CallerSdkTypeEnum } = require('firebase/data-connect');
const { useDataConnectQuery, useDataConnectMutation, validateReactArgs } = require('@tanstack-query-firebase/react/data-connect');


exports.useGetMyProfile = function useGetMyProfile(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(connectorConfig, dcOrOptions, options);
  const ref = getMyProfileRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}
exports.useCreateExercise = function useCreateExercise(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return createExerciseRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}


exports.useListPublicWorkoutRoutines = function useListPublicWorkoutRoutines(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(connectorConfig, dcOrOptions, options);
  const ref = listPublicWorkoutRoutinesRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}
exports.useLogWorkoutSession = function useLogWorkoutSession(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return logWorkoutSessionRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}
