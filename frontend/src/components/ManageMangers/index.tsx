import { useState, useEffect } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Box,
  Button,
  Modal,
  Select,
  PasswordInput,
  Badge,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons";
import { IconEdit, IconTrash } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import ManagerAPI from "../../api/ManagerAPI";
import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import { useForm } from "@mantine/form";

//Interface for manager data - (Raw data)
interface RowData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

//Get all manager records from the database
const getAllManagers = async () => {
  const response = await ManagerAPI.getManagers();
  const data = await response.data;
  return data;
};

//Stylings
const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

//Interface for Table header props
interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

//Create Table Headers
function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

//Filter Data
function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

//Sort Data
function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

// Manage managers component
const ManageMangers: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]); //state for storing and managing managers data
  const [loading, setLoading] = useState(true); //loading state for load handles

  // fetch manager data
  useEffect(() => {
    const fetchData = async () => {
      // show loading notification
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "manager data is loading..",
        autoClose: false,
        disallowClose: true,
      });

      // call to the API and get the all the details of the managers
      const result = await getAllManagers();
      const data = result.map((item: any) => {
        return {
          id: item._id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          role: item.role,
          bloodBankId: item.bloodBankId,
        };
      });
      setData(data);
      setLoading(false);
      const payload = {
        sortBy: null,
        reversed: false,
        search: "",
      };
      setSortedData(sortData(data, payload));

      // update the loading notificaiton to success
      updateNotification({
        id: "loding-data",
        color: "teal",
        title: "Data loaded successfully",
        message:
          "You can now manage manager by adding, editing or deleting them.",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    };
    fetchData();
  }, []);

  const [search, setSearch] = useState(""); //store search query
  const [sortedData, setSortedData] = useState(data); //store sorted data
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, setOpened] = useState(false); //manage add modal open state
  const [editOpened, setEditOpened] = useState(false); //manage open edit modal state

  //edit manager form
  const editManagers = async (values: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  }) => {
    showNotification({
      id: "edit-manager",
      loading: true,
      title: "Updating manager of " + values.name,
      message: "Updating manager record..",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.editManagers(values)
      .then((response) => {
        updateNotification({
          id: "edit-manager",
          color: "teal",
          title: "manager record updated successfully",
          message: "Updated manager record of " + values.name,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);
        const newData = data.map((item) => {
          if (item.id === values.id) {
            return {
              id: values.id,
              name: values.name,
              email: values.email,
              phone: values.phone,
              role: values.role,
            };
          } else {
            return item;
          }
        });
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setData(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "edit-manager",
          color: "red",
          title: "Update failed",
          message: "We were unable to update manager data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add manager
  const addManager = async (values: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => {
    showNotification({
      id: "add-manager",
      loading: true,
      title: "Adding manager record",
      message: "Please wait while we add manager record..",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.addManager(values)
      .then((response) => {
        updateNotification({
          id: "add-manager",
          color: "teal",
          title: "manager added successfully",
          message: "manager data added successfully.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        addForm.reset();
        setOpened(false);
        const newData = [
          ...data,
          {
            id: response.data._id,
            name: values.name,
            email: values.email,
            phone: values.phone,
            role: values.role,
          },
        ];
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setData(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "add-manager",
          color: "red",
          title: "Adding manager failed",
          message: "We were unable to add the manager to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete manager
  const deleteManager = async (id: string) => {
    showNotification({
      id: "delete-manager",
      loading: true,
      title: "Deleting manager",
      message: "Please wait while we delete the manager record",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.deleteManager(id)
      .then((response) => {
        updateNotification({
          id: "delete-manager",
          color: "teal",
          title: "manager record deleted successfully",
          message: "The manager record has been deleted successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        const newData = data.filter((item) => item.id !== id);
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setData(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "delete-manager",
          color: "red",
          title: "Deleting manager record failed",
          message: "We were unable to delete the manager record",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true, //when this true, form will be validated while user intract with the edit form
    initialValues: {
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "",
    },
    // edit form validations
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
      phone: (value) =>
        /^\d{10}$/.test(value)
          ? null
          : "Phone number must be 10 digits long number",
    },
  });

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "",
    },
    // add form validations
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
      phone: (value) =>
        /^\d{10}$/.test(value)
          ? null
          : "Phone number must be 10 digits long number",
      password: (value) =>
        value.length < 8 ? "Password must have at least 8 characters" : null,
    },
  });

  // sorting values function
  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  // handle search function
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  //Open delete modal
  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: "Delete this manager record?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this manager record? This action
          cannot be undone.
        </Text>
      ),
      labels: {
        confirm: "Delete manager record",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The manager record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteManager(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.id.slice(0, 7)}</td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.phone}</td>
      <td>
        {row.role === "MANAGER" ? (
          <Badge color="blue">Manager</Badge>
        ) : row.role === "SITE_MANAGER" ? (
          <Badge color="red">Site Manager</Badge>
        ) : (
          <Badge color="orange">Procurement Staff</Badge>
        )}
      </td>
      <td>
        {/* manager edit button */}
        <Button
          color="teal"
          leftIcon={<IconEdit size={14} />}
          onClick={() => {
            editForm.setValues({
              id: row.id,
              name: row.name,
              email: row.email,
              phone: row.phone,
              role: row.role,
            });
            setEditOpened(true);
          }}
          sx={{ margin: "5px", width: "100px" }}
        >
          Edit
        </Button>

        {/* Manager delete button */}
        <Button
          color="red"
          leftIcon={<IconTrash size={14} />}
          onClick={() => openDeleteModal(row.id)}
          sx={{ margin: "5px", width: "100px" }}
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      {/* Manager add form modal */}
      <Modal
        opened={opened}
        onClose={() => {
          addForm.reset();
          setOpened(false);
        }}
        title="Add User"
      >
        <form onSubmit={addForm.onSubmit((values) => addManager(values))}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...addForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...addForm.getInputProps("email")}
            required
          />
          <PasswordInput
            placeholder="Your password"
            label="Password"
            {...addForm.getInputProps("password")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone"
            {...addForm.getInputProps("phone")}
            required
          />
          <Select
            label="Select role"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={[
              { label: "Manager", value: "MANAGER" },
              { label: "Site Manager", value: "SITE_MANAGER" },
              { label: "Procurement Staff", value: "PROCUREMENT_STAFF" },
            ]}
            {...addForm.getInputProps("role")}
            required
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Add
          </Button>
        </form>
      </Modal>

      {/* Manager edit modal */}
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Edit User"
      >
        <form onSubmit={editForm.onSubmit((values) => editManagers(values))}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...editForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...editForm.getInputProps("email")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone"
            {...editForm.getInputProps("phone")}
            required
          />
          <Select
            label="Select role"
            placeholder="Pick one"
            data={[
              { label: "Manager", value: "MANAGER" },
              { label: "Site Manager", value: "SITE_MANAGER" },
              { label: "Procurement Staff", value: "PROCUREMENT_STAFF" },
            ]}
            {...addForm.getInputProps("role")}
            value={editForm.values.role}
            required
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Save
          </Button>
        </form>
      </Modal>
      <Box sx={{ margin: "20px", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "300px" }}
          />
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{ width: "200px", marginRight: "20px" }}
            onClick={() => setOpened(true)}
          >
            Add User
          </Button>
        </Box>

        {/* Manager details table */}
        <ScrollArea>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ tableLayout: "auto", width: "100%" }}
          >
            {/* Table headings */}
            <thead>
              <tr>
                <Th
                  sorted={sortBy === "id"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("id")}
                >
                  ID
                </Th>
                <Th
                  sorted={sortBy === "name"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("name")}
                >
                  Name
                </Th>
                <Th
                  sorted={sortBy === "email"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("email")}
                >
                  Email
                </Th>
                <Th
                  sorted={sortBy === "phone"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("phone")}
                >
                  Phone
                </Th>
                <Th
                  sorted={sortBy === "role"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("role")}
                >
                  Role
                </Th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <Text weight={500} align="center">
                      Loading
                    </Text>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <Text weight={500} align="center">
                      No items found
                    </Text>
                  </td>
                </tr>
              ) : (
                rows
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default ManageMangers;
