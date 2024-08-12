function taskReducer(tasks, action) {
  switch (action.type) {
    // eslint-disable-next-line no-lone-blocks
    case "ADD_TASK": {
      return [
        ...tasks,
        {
          subCategory: action.subCategory,
          subHeading: action.subHeading,
          question: action.question,
          realId: action.realId,
        },
      ];
    }
    case "SET_TASK": {
      return action.payload;
    }
    case "UPDATE_UPDATESTATUS": {
      let isOrNot = 0;
      return tasks.map((task) => {
        if (task._id === action.taskId) {
          const updatedStatus = task.updateStatus.map((subCat) => {
            if (subCat.userid === action.userid) {
              isOrNot = 1;
              return { ...subCat, status: action.status };
            }
            return subCat;
          });
          if (isOrNot === 0) {
            updatedStatus.push({
              userid: action.userid,
              status: "Solved",
              percent: "0%",
            });
          }
          return { ...task, updateStatus: updatedStatus };
        }
        return task;
      });
    }
    case "REMOVE_TASK": {
      return tasks.filter((task, index) => index !== action.id);
    }
    default: {
      throw Error("Unknown Action" + action.type);
    }
  }
}

export default taskReducer;
