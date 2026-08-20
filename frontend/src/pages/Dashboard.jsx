import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

    const [tasks, setTasks] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: ""
    });

    const [editingId, setEditingId] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [filterStatus, setFilterStatus] =
        useState("All");

    const [error, setError] =
        useState("");

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {

        try {

            const response =
                await API.get("/tasks");

            setTasks(response.data);

        } catch (error) {

            setError(
                "Unable to load tasks"
            );
        }
    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await API.put(
                    `/tasks/${editingId}`,
                    form
                );

            } else {

                await API.post(
                    "/tasks",
                    form
                );
            }

            resetForm();

            fetchTasks();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to save task"
            );
        }
    };

    const deleteTask = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await API.delete(
                `/tasks/${id}`
            );

            fetchTasks();

        } catch (error) {

            setError(
                "Unable to delete task"
            );
        }
    };

    const editTask = (task) => {

        setEditingId(task._id);

        setForm({
            title: task.title,
            description: task.description || "",
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate
                ? task.dueDate.substring(0, 10)
                : ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const resetForm = () => {

        setEditingId(null);

        setForm({
            title: "",
            description: "",
            status: "Pending",
            priority: "Medium",
            dueDate: ""
        });
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href =
            "/login";
    };

    const filteredTasks =
        tasks.filter((task) => {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesStatus =
                filterStatus === "All" ||
                task.status === filterStatus;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    return (
        <div className="dashboard">

            <header className="navbar">

                <div>
                    <h2>Task Manager</h2>
                </div>

                <div className="nav-right">

                    <span>
                        Hello, {user?.name}
                    </span>

                    <button
                        onClick={logout}
                        className="logout-btn"
                    >
                        Logout
                    </button>

                </div>

            </header>


            <main className="dashboard-content">

                <section className="welcome">

                    <h1>
                        Task Dashboard
                    </h1>

                    <p>
                        Create, manage and track
                        your tasks.
                    </p>

                </section>


                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}


                <section className="task-form-card">

                    <h2>
                        {editingId
                            ? "Edit Task"
                            : "Create New Task"}
                    </h2>

                    <form
                        className="task-form"
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="text"
                            name="title"
                            placeholder="Task title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Task description"
                            value={form.description}
                            onChange={handleChange}
                        />

                        <div className="form-row">

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option>
                                    Pending
                                </option>

                                <option>
                                    In Progress
                                </option>

                                <option>
                                    Completed
                                </option>
                            </select>


                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                <option>
                                    Low
                                </option>

                                <option>
                                    Medium
                                </option>

                                <option>
                                    High
                                </option>
                            </select>


                            <input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-buttons">

                            <button type="submit">
                                {editingId
                                    ? "Update Task"
                                    : "Add Task"}
                            </button>

                            {editingId && (

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>

                </section>


                <section className="task-section">

                    <div className="task-controls">

                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />


                        <select
                            value={filterStatus}
                            onChange={(e) =>
                                setFilterStatus(
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                All
                            </option>

                            <option>
                                Pending
                            </option>

                            <option>
                                In Progress
                            </option>

                            <option>
                                Completed
                            </option>

                        </select>

                    </div>


                    <div className="task-grid">

                        {filteredTasks.length === 0 ? (

                            <div className="empty">
                                <h3>
                                    No tasks found
                                </h3>

                                <p>
                                    Create your first
                                    task above.
                                </p>
                            </div>

                        ) : (

                            filteredTasks.map(
                                (task) => (

                                    <div
                                        className="task-card"
                                        key={task._id}
                                    >

                                        <div className="task-header">

                                            <h3>
                                                {task.title}
                                            </h3>

                                            <span
                                                className={`priority ${task.priority.toLowerCase()}`}
                                            >
                                                {task.priority}
                                            </span>

                                        </div>


                                        <p className="description">
                                            {task.description ||
                                                "No description"}
                                        </p>


                                        <div className="task-info">

                                            <span>
                                                Status:
                                                {" "}
                                                <strong>
                                                    {task.status}
                                                </strong>
                                            </span>

                                            {task.dueDate && (

                                                <span>
                                                    Due:
                                                    {" "}
                                                    {new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString()}
                                                </span>

                                            )}

                                        </div>


                                        <div className="task-actions">

                                            <button
                                                onClick={() =>
                                                    editTask(
                                                        task
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteTask(
                                                        task._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}

<div className="stats">

    <div className="stat-card">
        <h3>Total Tasks</h3>
        <strong>{totalTasks}</strong>
    </div>

    <div className="stat-card">
        <h3>Pending</h3>
        <strong>{pendingTasks}</strong>
    </div>

    <div className="stat-card">
        <h3>In Progress</h3>
        <strong>{inProgressTasks}</strong>
    </div>

    <div className="stat-card">
        <h3>Completed</h3>
        <strong>{completedTasks}</strong>
    </div>

</div>

const totalTasks = tasks.length;

const pendingTasks =
    tasks.filter(
        task => task.status === "Pending"
    ).length;

const inProgressTasks =
    tasks.filter(
        task => task.status === "In Progress"
    ).length;

const completedTasks =
    tasks.filter(
        task => task.status === "Completed"
    ).length;

export default Dashboard;