import * as React from "react";
import { useEffect, useContext, useState, useCallback, useMemo } from "react";
import TaskIDContext from "../context/TaskIDContext";
import TaskContext from "../context/TaskContext";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import Button from "@mui/material/Button";
import axios from "../Axios/axios.js";

function MaxHeightTextarea(props) {
  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(TextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 15px 15px;
    border-radius: 5px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: transparent;
    border: 1px solid rgb(64 64 64);
    margin-bottom: 20px;

    &:hover {
      border:1px solid black;
    }

    &:focus {
      border:2px solid rgb(29 78 216);
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  return (
    <div>
      <label className="text-lg">Question</label>
      <Textarea
        className="mt-3"
        minRows={4}
        aria-label="maximum height"
        placeholder="Question"
        defaultValue={props.value}
        readOnly
      />
    </div>
  );
}

function AllRateComponent({ allRate, tasks }) {
  const rateDisplay = useMemo(() => {
    return allRate ? ((allRate / tasks.length) * 100).toFixed(2) : "0";
  }, [allRate]);

  return <div className="text-lg">All Rate: {rateDisplay}%</div>;
}

function UserTask() {
  const { taskId, taskIDDispatch } = useContext(TaskIDContext);
  const { tasks } = useContext(TaskContext);
  const [task, setTask] = useState();
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [order, setOrder] = useState([]);
  const [showAnswer, setShowAnswer] = useState("");
  const [currentPercent, setCurrentPercent] = useState([0, 0, 0, 0]);
  const [allRate, setAllRate] = useState(0);

  useEffect(() => {
    let currentTask = null;
    let relatedTaskIds = [];

    for (const task of tasks) {
      if (task._id === taskId) {
        currentTask = task;
      }
      if (currentTask && task.subCategory === currentTask.subCategory) {
        relatedTaskIds.push(task._id);
      }
    }
    setTask(currentTask);
    setOrder(relatedTaskIds);
  }, [taskId, tasks]);

  function handleAnswerClick(str) {
    setSelectedAnswer(str);
  }

  const handleSubmit = useCallback(() => {
    const temp = [...currentPercent];
    const index = temp.indexOf(0);
    if (index !== -1) {
      temp[index] = selectedAnswer === task?.correctAnswer ? 1 : 2;
      setCurrentPercent(temp);
      if (selectedAnswer === task?.correctAnswer) {
        setTimeout(async () => {
          await next(task._id);
        }, 2000);
      }
    }
  }, [currentPercent, selectedAnswer, task]);

  const next = async (_taskId) => {
    setAllRate(allRate + 1);
    setCurrentPercent([0, 0, 0, 0]);
    setSelectedAnswer("_");
    const currentIndex = order.indexOf(_taskId);
    if (currentIndex !== -1 && currentIndex < order.length - 1) {
      const nextTask = tasks.find((obj) => obj._id === order[currentIndex + 1]);
      setTask(nextTask);
      taskIDDispatch({
        type: "SET_TASKID",
        payload: order[currentIndex + 1],
      });
    }
    let clientId = localStorage.getItem("clientId");
    let cleanStr = clientId.slice(1, -1);
    try {
      await axios.put("/client/setRate", {
        id: cleanStr,
        allRate: allRate + 1,
      });
    } catch (error) {
      console.error("Error updating apply:", error);
    }
  };

  return (
    <div className="py-4 rounded-lg shadow-md flex items-center justify-center gap-2 m-3 mt-20">
      <div className="task-info text-slate-900 text-sm w-10/12">
        <div>
          <MaxHeightTextarea value={task?.question} />
        </div>
        <div className="grid gap-4">
          <label className="text-lg">Answer</label>
          <OutlinedInput
            id="outlined-adornment-amount1"
            defaultValue="Answer A"
            value={task?.answerA}
            startAdornment={<InputAdornment position="start">A</InputAdornment>}
            readOnly
            onClick={() => handleAnswerClick("A")}
          />
          <OutlinedInput
            className="w-full"
            id="outlined-required"
            defaultValue="Answer B"
            value={task?.answerB}
            startAdornment={<InputAdornment position="start">B</InputAdornment>}
            readOnly
            onClick={() => handleAnswerClick("B")}
          />
          <OutlinedInput
            className="w-full"
            id="outlined-required"
            defaultValue="Answer C"
            value={task?.answerC}
            startAdornment={<InputAdornment position="start">C</InputAdornment>}
            readOnly
            onClick={() => handleAnswerClick("C")}
          />
          {task?.answerD ? (
            <OutlinedInput
              className="w-full"
              id="outlined-required"
              defaultValue="Answer D"
              value={task?.answerD}
              startAdornment={
                <InputAdornment position="start">D</InputAdornment>
              }
              readOnly
              onClick={() => handleAnswerClick("D")}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex justify-between mt-5">
          <div className="text-lg flex items-center">
            Selected Answer:&nbsp;&nbsp;&nbsp;
            <span className="text-4xl text-sky-300"> {selectedAnswer}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="contained"
              endIcon={<RemoveRedEyeIcon />}
              size="large"
              onMouseDown={() => setShowAnswer(task?.correctAnswer)}
              onMouseUp={() => setShowAnswer("")}
            >
              Preview
            </Button>
            <span className="text-4xl text-sky-300">{showAnswer || "_"}</span>
          </div>

          <Button
            variant="contained"
            endIcon={<DoubleArrowIcon />}
            size="large"
            onClick={() => handleSubmit(task)}
            disabled={selectedAnswer ? false : true}
          >
            Confirm
          </Button>
        </div>

        <div className="flex justify-around mt-7">
          <div className="flex gap-4">
            {currentPercent.map((val, index) => {
              if (val === 0) {
                return (
                  <div
                    key={index}
                    className="w-5 h-5 bg-gray-600 rounded-full"
                  ></div>
                );
              } else if (val === 1) {
                return (
                  <div
                    key={index}
                    className="w-5 h-5 bg-lime-400 rounded-full"
                  ></div>
                );
              } else if (val === 2) {
                return (
                  <div
                    key={index}
                    className="w-5 h-5 bg-red-600 rounded-full"
                  ></div>
                );
              }
            })}
          </div>
          <AllRateComponent allRate={allRate} tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

export default UserTask;
