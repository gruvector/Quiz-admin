import * as React from "react";
import axios from "../../Axios/axios.js";
import { useContext, useState, useEffect } from "react";
import TaskContext from "../../context/TaskContext";
import TaskIDContext from "../../context/TaskIDContext";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function UserNavbar() {
  const [categories, setCategories] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState();
  const { tasks } = useContext(TaskContext);
  const { taskId, taskIDDispatch } = useContext(TaskIDContext);

  useEffect(() => {
    async function getCategoryFunc() {
      try {
        const res = await axios.get("/category/getCategory");
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getCategoryFunc();
  }, []);

  useEffect(() => {
    setSelectedTaskId(taskId);
  }, [taskId]);

  const handleTaskClick = (taskId) => {
    taskIDDispatch({
      type: "SET_TASKID",
      payload: taskId,
    });
    setSelectedTaskId(taskId);
  };

  return (
    <div className="text-center">
      <div>
        {categories.length !== 0 ? (
          categories.map((category, index) => {
            return (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={"panel" + index + "-content"}
                  id={"panel" + index + "-header"}
                >
                  {category.name}
                </AccordionSummary>
                <AccordionDetails>
                  {tasks.length !== 0 ? (
                    tasks.map((task, taskindex) => {
                      if (category.name === task.subCategory) {
                        return (
                          <p
                            key={taskindex}
                            className={
                              task._id === selectedTaskId
                                ? "mb-2 font-semibold line-clamp-1 cursor-pointer text-sky-400 text-lg underline decoration-sky-400"
                                : "mb-2 font-semibold line-clamp-1 cursor-pointer"
                            }
                            onClick={() => handleTaskClick(task._id)}
                          >
                            {task.subHeading}
                          </p>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <h1>No Task Found</h1>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <h1>No Category Found</h1>
        )}
      </div>
    </div>
  );
}

export default UserNavbar;
