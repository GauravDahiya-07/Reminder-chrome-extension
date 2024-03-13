import React, { useState, useEffect } from "react";
import '../App.css'
import {
  TextField,
  MenuItem,
  Container,
  Grid,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SelectChangeEvent } from "@mui/material/Select";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';

export interface Reminder {
  id: number;
  name: string;
  remindAt: string;
  frequency: string;
  dayOfWeek?: string;
  dayOfMonth?: number;
}

const HomePage: React.FC = () => {
  const [dayOfWeek, setDayOfWeek] = useState<string>("Sunday");
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminders, setShowReminders] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const [newReminder, setNewReminder] = useState<Reminder>({
    id: new Date().getTime(),
    name: "",
    remindAt: "",
    frequency: "once",
  });

  const daysOfWeekArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const daysOfMonthArray = Array.from({ length: 31 }, (_, index) => index + 1);

  const isSaveButtonDisabled =
    !newReminder.name ||
    !newReminder.frequency ||
    (newReminder.frequency === "once" && !newReminder.remindAt) ||
    (newReminder.frequency === "daily" && !newReminder.remindAt) ||
    (newReminder.frequency === "weekly" && !dayOfWeek) ||
    (newReminder.frequency === "monthly" && !dayOfMonth);

  useEffect(() => {
    const storedReminders = JSON.parse(
      localStorage.getItem("reminders") || "[]"
    );

    setReminders(storedReminders);
  }, []);

  const handleEditReminder = (id: number) => {
    const reminderToEdit = reminders.find((reminder) => reminder.id === id);
    console.log(reminderToEdit)
    if (reminderToEdit) {
      setEditingReminder(reminderToEdit);
      setNewReminder({
        ...reminderToEdit,
        remindAt: reminderToEdit.remindAt ? new Date(reminderToEdit.remindAt).toISOString() : "",
      });
    }
  };
  
  
  const handleSaveReminder = () => {
    if (editingReminder) {
      setReminders((prevReminders) => {
        const updatedReminders = prevReminders.map((reminder) =>
          reminder.id === editingReminder.id ? { ...newReminder } : reminder
        );
        localStorage.setItem("reminders", JSON.stringify(updatedReminders));
        return updatedReminders;
      });
      setEditingReminder(null);
    } else {
      setReminders((prevReminders) => {
        const updatedReminders = [
          ...prevReminders,
          {
            ...newReminder,
            dayOfWeek: newReminder.frequency === "weekly" ? dayOfWeek : undefined,
            dayOfMonth:
              newReminder.frequency === "monthly" ? dayOfMonth : undefined,
          },
        ];
        localStorage.setItem("reminders", JSON.stringify(updatedReminders));
        return updatedReminders;
      });
    }

    setNewReminder({
      id: new Date().getTime(),
      name: "",
      remindAt: "",
      frequency: "once",
    });
  };


  const handleDeleteReminder = (id: number) => {
    setReminders((prevReminders) => {
      const updatedReminders = prevReminders.filter(
        (reminder) => reminder.id !== id
      );

      localStorage.setItem("reminders", JSON.stringify(updatedReminders));
      return updatedReminders;
    });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card variant="outlined" sx={{ maxWidth: 360, margin: 2 }}>
        <Box sx={{ p: 2, backgroundColor: "#75b666", marginBottom: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Set a Reminder
          </Typography>
        </Box>
        <Grid container spacing={1.5} sx={{ marginX: "auto", marginY: "auto" }}>
          <Grid item xs={11}>
            <TextField
              label="Remind About"
              fullWidth
              value={newReminder.name}
              name="name"
              color="success"
              focused
              onChange={(
                e: React.ChangeEvent<{
                  name?: string | undefined;
                  value: unknown;
                }>
              ) =>
                setNewReminder((prevReminder) => ({
                  ...prevReminder,
                  name: e.target.value as string,
                }))
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth color="success" focused>
              <InputLabel>Frequency</InputLabel>
              <Select
                label="Frequency"
                name="frequency"
                value={newReminder.frequency}
                onChange={(e: SelectChangeEvent<string>) =>
                  setNewReminder((prevReminder) => ({
                    ...prevReminder,
                    frequency: e.target.value as string,
                  }))
                }
              >
                <MenuItem value="once">Once</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={7}
            sx={{
              "& .MuiTextField-root": {
                "& fieldset": {
                  borderColor: "#4a8939 !important",
                  borderWidth: "2px",
                },
              },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {newReminder.frequency === "once" && (
                <MobileDateTimePicker
                  label="Date and Time"
                  disablePast
                  views={["year", "month", "day", "hours", "minutes"]}
                  onChange={(date: Date | null) =>
                    setNewReminder((prevReminder) => ({
                      ...prevReminder,
                      remindAt: date ? date.toISOString() : "",
                    }))
                  }
                  sx={{
                    "& .MuiInputLabel-root": { color: "#4a8939 !important" },
                  }}
                />
              )}
              {newReminder.frequency === "daily" && (
                <MobileDateTimePicker
                  label="Time"
                  views={["hours", "minutes"]}
                  onChange={(date: Date | null) =>
                    setNewReminder((prevReminder) => ({
                      ...prevReminder,
                      remindAt: date ? date.toISOString() : "",
                    }))
                  }
                  sx={{
                    "& .MuiInputLabel-root": { color: "#4a8939 !important" },
                  }}
                />
              )}
              {newReminder.frequency === "weekly" && (
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <FormControl fullWidth color="success" focused>
                      <InputLabel>Day</InputLabel>
                      <Select
                        label="Day of Week"
                        name="dayOfWeek"
                        value={dayOfWeek}
                        onChange={(e: SelectChangeEvent<string>) =>
                          setDayOfWeek(e.target.value as string)
                        }
                      >
                        {daysOfWeekArray.map((day) => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDateTimePicker
                        label="Time"
                        views={["hours", "minutes"]}
                        onChange={(date: Date | null) =>
                          setNewReminder((prevReminder) => ({
                            ...prevReminder,
                            remindAt: date ? date.toISOString() : "",
                          }))
                        }
                        sx={{
                          "& .MuiInputLabel-root": {
                            color: "#4a8939 !important",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              )}

              {newReminder.frequency === "monthly" && (
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <FormControl fullWidth color="success" focused>
                      <InputLabel>Date</InputLabel>
                      <Select
                        label="Day of Month"
                        name="dayOfMonth"
                        value={dayOfMonth}
                        onChange={(e: SelectChangeEvent<number>) =>
                          setDayOfMonth(e.target.value as number)
                        }
                      >
                        {daysOfMonthArray.map((day) => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDateTimePicker
                        label="Time"
                        views={["hours", "minutes"]}
                        onChange={(date: Date | null) =>
                          setNewReminder((prevReminder) => ({
                            ...prevReminder,
                            remindAt: date ? date.toISOString() : "",
                          }))
                        }
                        sx={{
                          "& .MuiInputLabel-root": {
                            color: "#4a8939 !important",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              )}
            </LocalizationProvider>
          </Grid>

          <Grid container item xs={12}>
            <Button
              variant="contained"
              sx={{
                marginRight: "8px",
                marginBottom: "8px",
                backgroundColor: "#75b666",
                "&:hover": {
                  backgroundColor: "#407830",
                },
              }}
              size="small"
              onClick={handleSaveReminder}
              endIcon={<SaveIcon />}
              disabled={isSaveButtonDisabled}
            >
              Save Reminder
            </Button>
            <Button
              variant="contained"
              sx={{
                marginBottom: "8px",
                backgroundColor: "#75b666",
                "&:hover": {
                  backgroundColor: "#407830",
                },
              }}
              size="small"
              endIcon={<ArrowCircleRightIcon />}
              onClick={() => setShowReminders(!showReminders)}
            >
              {showReminders ? "Hide Reminders" : "Show Reminders"}
            </Button>
            <div className="scroll-container">
            {showReminders && (
              <div style={{ overflowX: 'auto'}}>
              <TableContainer >
                <Table sx={{ minWidth: 550 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Description
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Remind On
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Time
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Recurrence
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Edit / Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reminders.map((reminder) => (
                      <TableRow key={reminder.id}>
                        <TableCell align="center">{reminder.name}</TableCell>

                        <TableCell align="center">
                        {reminder.frequency === "once" 
                            ? new Date(reminder.remindAt).toLocaleDateString("en-GB")
                            : reminder.frequency === "daily"
                            ? ` Daily `
                            : reminder.frequency === "weekly"
                            ? `Every ${reminder.dayOfWeek}`
                            : reminder.frequency === "monthly" &&
                              reminder.dayOfMonth !== undefined
                            ? `Day ${reminder.dayOfMonth} of Every Month`
                            : ""}
                        </TableCell>

                        <TableCell align="center">
                          {new Date(reminder.remindAt).toLocaleTimeString(
                            "en-GB"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {reminder.frequency}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton aria-label="delete" size="small"
                              onClick={() => handleEditReminder(reminder.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton aria-label="delete" size="small"
                               onClick={() => handleDeleteReminder(reminder.id)}
                          >
                            <DeleteIcon fontSize="small"  />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </div>
            )}
            </div>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default HomePage;
