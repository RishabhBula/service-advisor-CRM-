// const getCustomersLogic = createLogic({
//   type: usersActions.GET_USER_LIST,
//   async process({ action }, dispatch, done) {
//     dispatch(showLoader());
//     let api = new ApiHelper();
//     let result = await api.FetchFromServer(
//       "/user",
//       "/list",
//       "GET",
//       true,
//       action.payload,
//       undefined
//     );
//     if (result.isError) {
//       toast.error(result.messages[0]);
//       dispatch(hideLoader());
//       done();
//       return;
//     } else {
//       dispatch(hideLoader());
//       done();
//     }
//   }
// });

// const addCustomersLogic = createLogic({
//   type: usersActions.ADD_USER,
//   async process({ action }, dispatch, done) {
//     dispatch(showLoader());
//     logger(action.payload);

//     // dispatch(hideLoader());
//     done();
//   }
// });

export const CustomersLogic = [];
