import React from "react";
import { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import axios from "../Axios/axios.js";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CssBaseline from "@mui/material/CssBaseline";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TaskContext from "../context/TaskContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionAdd = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const defaultTheme = createTheme();
const vertical = "bottom";
const horizontal = "center";

const UserManagement = () => {
  const { tasks } = useContext(TaskContext);

  const [people, setPeople] = useState([]);
  const [checked, setChecked] = useState(null);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [snackText, setSnackText] = useState("");
  const [status, setStatus] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [ageValue, setAgeValue] = useState(0);
  const [clientId, setClientId] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handleClickOpen(id) {
    setDeleteId(id);
    setOpen(true);
  }

  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  async function handleAgree(id) {
    setOpen(false);
    try {
      await axios.post("/client/deleteClient", {
        id: id,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating apply:", error);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleClickEdit = async (e, clientid) => {
    e.preventDefault();
    setStatus("edit");
    try {
      const res1 = await axios.get(`/client/getClient/${clientid}`);
      setNameValue(res1.data.name);
      setEmailValue(res1.data.email);
      setAgeValue(parseInt(res1.data.age));
      setClientId(clientid);
      setOpenAdd(true);
    } catch (error) {
      console.error("Error updating apply:", error);
    }
  };

  async function handleChange(id, event) {
    const apply = event.target.checked; // Boolean state of the checkbox
    try {
      await axios.put("/client/setApply", {
        id: id,
        apply: apply,
      });
      setChecked(apply);
    } catch (error) {
      console.error("Error updating apply:", error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let name = data.get("name");
    let email = data.get("email");
    let age = data.get("age");
    let pwd = data.get("password");

    try {
      if (status === "edit") {
        pwd === ""
          ? await axios.post(`/client/editClient/${clientId}`, {
              name: name,
              email: email,
              age: age,
            })
          : await axios.post(`/client/editClient/${clientId}`, {
              name: name,
              email: email,
              password: pwd,
              age: age,
            });
      } else {
        await axios.post("/client/registerClient", {
          name: name,
          email: email,
          password: pwd,
          age: age,
        });
      }
      window.location.reload();
      setSnackText("成果的に登録されました。");
      setOpenSnack(true);
    } catch (error) {
      console.error("Error updating apply:", error);
      setSnackText(error.response.data.message);
      setOpenSnack(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/client/getAllClient"); // Ensure URL matches your API endpoint
        setPeople(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    setChecked(null);
  }, [checked]);

  const percent = (allRate) => {
    return allRate ? ((allRate / tasks.length) * 100).toFixed(2) : "0";
  };

  return (
    <div className="flex flex-col px-10 mt-10">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-start inline-block w-1/6 sm:px-6 lg:px-8">
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              setStatus("");
              setNameValue("");
              setEmailValue("");
              setAgeValue("");
              setOpenAdd(true);
            }}
          >
            Add User
          </Button>
        </div>
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Age
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    LICENCE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    password
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rating
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Apply / NOT
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Edit / Remove
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {people.map((person) => (
                  <tr key={person.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="ml-4">{person.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="ml-4">{person.age}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="ml-4">{person._id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="ml-4">{person.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center ">
                        <div className="ml-4 w-48 truncate">
                          {person.password}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="ml-4">{percent(person.rating)}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <IOSSwitch
                        sx={{ m: 1 }}
                        checked={person.apply}
                        onChange={(e) => handleChange(person._id, e)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <IconButton
                        aria-label="edit"
                        onClick={(e) => handleClickEdit(e, person._id)}
                      >
                        <EditIcon />
                      </IconButton>{" "}
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleClickOpen(person._id)}
                      >
                        <DeleteIcon />
                      </IconButton>{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSnack}
        onClose={handleCloseSnack}
        message={snackText}
        key={vertical + horizontal}
      />

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure that delete the selected user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={() => handleAgree(deleteId)}>Agree</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAdd}
        TransitionComponent={TransitionAdd}
        keepMounted
        onClose={handleCloseAdd}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {status === "edit" ? "Edit User" : "Add User"}
        </DialogTitle>
        <DialogContent>
          <div className="">
            <ThemeProvider theme={defaultTheme}>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={nameValue}
                          onChange={(event) => {
                            setNameValue(event.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Age"
                          name="age"
                          type="number"
                          value={ageValue}
                          onChange={(event) => {
                            setAgeValue(event.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Email"
                          name="email"
                          value={emailValue}
                          onChange={(event) => {
                            setEmailValue(event.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel htmlFor="outlined-adornment-password">
                            Password*
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            required
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          {status === "edit" ? "Edit" : "Add"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
