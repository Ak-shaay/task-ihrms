import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import axios from "axios";

function LeaveAsha() {
  const [employeeId, setEmployeeId] = useState(100);
  const [type, setType] = useState(""); 
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/leave/id", { id: employeeId });
      setLeaves(res.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const handleSubmit = async () => {
    if (!employeeId || !type || !startDate || !endDate) {
      alert("Please fill all required fields");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/leave/apply", {
        id: employeeId,
        type,
        reason,
        starting: startDate,
        ending: endDate,
        leaveStatus: "Pending",
      });

      alert("Leave request submitted successfully!");
      setType("");
      setReason("");
      setStartDate("");
      setEndDate("");
      fetchLeaves();
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request");
    }
  };

  return (
    <div>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            required
            id="employee-id"
            label="Employee ID"
            value={employeeId}
            inputProps={{ readOnly: true }}
          />

          <FormControl sx={{ m: 1, width: "25ch" }}>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="sick">Sick</MenuItem>
              <MenuItem value="annual">Annual</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
            </Select>
          </FormControl>

          <TextField
            id="reason"
            label="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ m: 1, width: "25ch" }}
          />

          <TextField
            id="start-date"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ m: 1, width: "25ch" }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            id="end-date"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ m: 1, width: "25ch" }}
            InputLabelProps={{ shrink: true }}
          />

          <Button variant="contained" sx={{ m: 1 }} onClick={handleSubmit}>
            Apply
          </Button>
        </div>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Leave ID</b></TableCell>
              <TableCell><b>Employee ID</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Reason</b></TableCell>
              <TableCell><b>From</b></TableCell>
              <TableCell><b>To</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Comment</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.leave_id}>
                <TableCell>{leave.leave_id}</TableCell>
                <TableCell>{leave.id}</TableCell>
                <TableCell>{leave.type}</TableCell>
                <TableCell>{leave.reason || "Nil"}</TableCell>
                <TableCell>
                  {leave.starting ? new Date(leave.starting).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>
                  {leave.ending ? new Date(leave.ending).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>{leave.leaveStatus || "Pending"}</TableCell>
                <TableCell>{leave.comment || "Nil"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default LeaveAsha;
