import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    TextField,
    Box,
} from "@mui/material";

function Home() {
    const [data, setData] = useState([]);
    const [filterId, setFilterId] = useState("");
    const [filterName, setFilterName] = useState("");
    const [filterFrom, setFilterFrom] = useState("");
    const [filterTo, setFilterTo] = useState("");
    const [comment, setComment] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.post("http://localhost:8080/api/leave");
            setData(res.data);
            console.log(res.data);

        } catch (err) {
            console.error("error fetching data", err);
        }
    };

    const handleAction = async (leaveId, action) => {
        try {
            await axios.post("http://localhost:8080/api/leave/update", {
                leave_id: leaveId,
                status: action,
                comment: comment[leaveId] || "",
            });

            setData((prev) =>
                prev.map((leave) =>
                    leave.leave_id === leaveId
                        ? { ...leave, leaveStatus: action, comment: comment[leaveId] }
                        : leave
                )
            );

            setComment((prev) => ({ ...prev, [leaveId]: "" }));
        } catch (error) {
            console.error("Error updating leave status:", error);
            alert("Failed to update leave status. Please try again.");
        }
    };

    const filteredData = data.filter((item) => {
        // const pending = !item.leaveStatus || item.leaveStatus === "Pending";
        const byId = filterId ? item.id.toString() === filterId : true;
        const byName = filterName ? item.name.toLowerCase().includes(filterName.toLowerCase()) : true;
        const fromDate = filterFrom ? new Date(item.starting) >= new Date(filterFrom) : true;
        const toDate = filterTo ? new Date(item.ending) <= new Date(filterTo) : true;
        return byId && byName && fromDate && toDate;
    });

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                <TextField
                    label="Filter by Employee Name"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
                <TextField
                    label="Filter by Employee ID"
                    value={filterId}
                    onChange={(e) => setFilterId(e.target.value)}
                />
                <TextField
                    label="From Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filterFrom}
                    onChange={(e) => setFilterFrom(e.target.value)}
                />
                <TextField
                    label="To Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filterTo}
                    onChange={(e) => setFilterTo(e.target.value)}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Leave ID</b></TableCell>
                            <TableCell><b>ID</b></TableCell>
                            <TableCell><b>Employee</b></TableCell>
                            <TableCell><b>Reason</b></TableCell>
                            <TableCell><b>From</b></TableCell>
                            <TableCell><b>To</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell><b>Comment</b></TableCell>
                            <TableCell><b>Action</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item.leave_id}>
                                <TableCell>{item.leave_id}</TableCell>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.reason}</TableCell>
                                <TableCell>
                                    {item.starting ? new Date(item.starting).toLocaleDateString() : "-"}
                                </TableCell>
                                <TableCell>
                                    {item.ending ? new Date(item.ending).toLocaleDateString() : "-"}
                                </TableCell>
                                <TableCell>{item.leaveStatus || "Pending"}</TableCell>

                                <TableCell>
                                    {item.leaveStatus && item.leaveStatus !== "Pending" ? (
                                        <span>{item.comment || "No comment"}</span>
                                    ) : (
                                        <TextField
                                            placeholder="Add comment"
                                            value={comment[item.leave_id] || ""}
                                            onChange={(e) =>
                                                setComment((prev) => ({
                                                    ...prev,
                                                    [item.leave_id]: e.target.value,
                                                }))
                                            }
                                        />
                                    )}
                                </TableCell>

                                <TableCell>
                                    {(!item.leaveStatus || item.leaveStatus === "Pending") && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                sx={{ mr: 1 }}
                                                onClick={() => handleAction(item.leave_id, "Approved")}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleAction(item.leave_id, "Rejected")}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Home;
