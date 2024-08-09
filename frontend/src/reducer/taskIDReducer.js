function taskIDReducer(taskId, action) {
  switch (action.type) {
    case "SET_TASKID": {
      return (taskId = action.payload);
    }
    default: {
      throw Error("Unknown Action" + action.type);
    }
  }
}

export default taskIDReducer;
