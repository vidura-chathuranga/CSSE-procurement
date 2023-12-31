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

//Interface for supplier data - (Raw data)
interface RowData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

//Get all supplier records from the database
const getAllSuppliers = async () => {
  const response = await ManagerAPI.getSuppliers();
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

const ManageSuppliers: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch supplier data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "supplier data is loading..",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllSuppliers();
      const data = result.map((item: any) => {
        return {
          id: item._id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          address: item.address,
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
      updateNotification({
        id: "loding-data",
        color: "teal",
        title: "Data loaded successfully",
        message:
          "You can now manage supplier by adding, editing or deleting them.",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    };
    fetchData();
  }, []);

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  //edit supplier form
  const editSupplier = async (values: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    showNotification({
      id: "edit-supplier",
      loading: true,
      title: "Updating supplier of " + values.name,
      message: "Updating supplier record..",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.editSupplier(values)
      .then((response) => {
        updateNotification({
          id: "edit-supplier",
          color: "teal",
          title: "supplier record updated successfully",
          message: "Updated supplier record of " + values.name,
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
              address: values.address,
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
          id: "edit-supplier",
          color: "red",
          title: "Update failed",
          message: "We were unable to update supplier data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add supplier
  const addSupplier = async (values: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    showNotification({
      id: "add-supplier",
      loading: true,
      title: "Adding supplier record",
      message: "Please wait while we add supplier record..",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.addSupplier(values)
      .then((response) => {
        updateNotification({
          id: "add-supplier",
          color: "teal",
          title: "supplier added successfully",
          message: "supplier data added successfully.",
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
            address: values.address,
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
          id: "add-supplier",
          color: "red",
          title: "Adding supplier failed",
          message: "We were unable to add the supplier to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete supplier
  const deleteSupplier = async (id: string) => {
    showNotification({
      id: "delete-supplier",
      loading: true,
      title: "Deleting supplier",
      message: "Please wait while we delete the supplier record",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.deleteSupplier(id)
      .then((response) => {
        updateNotification({
          id: "delete-supplier",
          color: "teal",
          title: "supplier record deleted successfully",
          message: "The supplier record has been deleted successfully",
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
          id: "delete-supplier",
          color: "red",
          title: "Deleting supplier record failed",
          message: "We were unable to delete the supplier record",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
    },
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
      phone: "",
      address: "",
    },
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

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

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
      title: "Delete this supplier record?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this supplier record? This action cannot
          be undone.
        </Text>
      ),
      labels: { confirm: "Delete supplier record", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The supplier record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteSupplier(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.phone}</td>
      <td>
        {row.address}
      </td>
      <td>
        <Button
          color="teal"
          leftIcon={<IconEdit size={14} />}
          onClick={() => {
            editForm.setValues({
              id: row.id,
              name: row.name,
              email: row.email,
              phone: row.phone,
              address: row.address,
            });
            setEditOpened(true);
          }}
          sx={{ margin: "5px", width: "100px" }}
        >
          Edit
        </Button>
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
      <Modal
        opened={opened}
        onClose={() => {
          addForm.reset();
          setOpened(false);
        }}
        title="Add supplier Record"
      >
        <form onSubmit={addForm.onSubmit((values) => addSupplier(values))}>
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
          <TextInput
            label="Phone"
            placeholder="Enter phone"
            {...addForm.getInputProps("phone")}
            required
          />
          <TextInput
            placeholder="Your Address"
            label="Address"
            {...addForm.getInputProps("address")}
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
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Edit supplier Record"
      >
        <form onSubmit={editForm.onSubmit((values) => editSupplier(values))}>
          <TextInput
            label="ID"
            placeholder="Enter ID"
            disabled
            {...editForm.getInputProps("id")}
            required
          />
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
          <TextInput
            placeholder="Your Address"
            label="Address"
            {...editForm.getInputProps("address")}
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
            Add supplier Record
          </Button>
        </Box>
        <ScrollArea>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ tableLayout: "auto", width: "100%" }}
          >
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
                  sorted={sortBy === "address"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("address")}
                >
                  Address
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

export default ManageSuppliers;
