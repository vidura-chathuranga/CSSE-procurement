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

//Interface for site data - (Raw data)
interface RowData {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: string;
}

//Interface for site data - (Raw data)
interface RowDataManagers {
  value: string;
  label: string;
}


//Get all sites records from the database
const getAllSites = async () => {
  const response = await ManagerAPI.getSites();
  const data = await response.data;
  return data;
};

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

const ManageSites: React.FC = () => {

  // store and manage sites data
  const [data, setData] = useState<RowData[]>([]);

  // controll the data fetching loading state
  const [loading, setLoading] = useState(true);

  // store and manage manager details
  const [managers, setManagers] = useState<RowDataManagers[]>([]);

  // fetch site data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "site data is loading..",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllSites();
      const data = result.map((item: any) => {
        return {
            id: item._id,
            name: item.name,
            address: item.address,
            phone: item.phone,
            manager: item.manager,
            status: item.status,
        };
      });
      setData(data);

      const resultManagers = await getAllManagers();
      const managers = resultManagers.map((item: any) => {
        return {
            label: item.name,
            value: item._id,
        };
      });
      setManagers(managers);
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

  //edit site form
  const editSite = async (values: {
    id: string;
    name: string;
    address: string;
    phone: string;
    manager: string;
    status: string;
  }) => {
    showNotification({
      id: "edit-site",
      loading: true,
      title: "Updating site of " + values.name,
      message: "Updating site record..",
      autoClose: true,
      disallowClose: true,
    });
    ManagerAPI.editSite(values)
      .then((response) => {
        updateNotification({
          id: "edit-site",
          color: "teal",
          title: "site record updated successfully",
          message: "Updated site record of " + values.name,
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
              address: values.address,
                phone: values.phone,
                manager: values.manager,
                status: values.status,
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
          id: "edit-site",
          color: "red",
          title: "Update failed",
          message: "We were unable to update site data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add site
  const addSite = async (values: {
    name: string;
    address: string;
    phone: string;
    manager: string;
    status: string;
  }) => {
    showNotification({
      id: "add-site",
      loading: true,
      title: "Adding site record",
      message: "Please wait while we add site record..",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.addSite(values)
      .then((response) => {
        updateNotification({
          id: "add-site",
          color: "teal",
          title: "site added successfully",
          message: "site data added successfully.",
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
            address: values.address,
            phone: values.phone,
            manager: values.manager,
            status: values.status,

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
          id: "add-site",
          color: "red",
          title: "Adding site failed",
          message: "We were unable to add the site to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete site
  const deleteSite = async (id: string) => {
    showNotification({
      id: "delete-site",
      loading: true,
      title: "Deleting site",
      message: "Please wait while we delete the site record",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.deleteSite(id)
      .then((response) => {
        updateNotification({
          id: "delete-site",
          color: "teal",
          title: "site record deleted successfully",
          message: "The site record has been deleted successfully",
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
          id: "delete-site",
          color: "red",
          title: "Deleting site record failed",
          message: "We were unable to delete the site record",
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
        address: "",
        phone: "",
        manager: "",
        status: "",
    },
    // validation for editing sites
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
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
        address: "",
        phone: "",
        manager: "",
        status: "",
    },

    // validations for the editing sites details
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
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
      title: "Delete this product record?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this product record? This action cannot
          be undone.
        </Text>
      ),
      labels: { confirm: "Delete product record", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The product record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteSite(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{row.name}</td>
        <td>{row.address}</td>
        <td>{row.phone}</td>
        <td>{managers.find((manager) => manager.value === row.manager)?.label}</td>
        <td>{row.status}</td>
      <td>
        <Button
          color="teal"
          leftIcon={<IconEdit size={14} />}
          onClick={() => {
            editForm.setValues({
              id: row.id,
              name: row.name,
                address: row.address,
                phone: row.phone,
                manager: row.manager,
                status: row.status,
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

      {/* add site form modal */}
      <Modal
        opened={opened}
        onClose={() => {
          addForm.reset();
          setOpened(false);
        }}
        title="Add Site record"
      >
        <form onSubmit={addForm.onSubmit((values) => addSite(values))}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...addForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Address"
            placeholder="Enter Address"
            {...addForm.getInputProps("address")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter Phone "
            {...addForm.getInputProps("phone")}
            required
          />
          <Select
            label="Select Manager"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={managers}
            {...addForm.getInputProps("manager")}
            required
          />
            <Select
            placeholder="Status"
            label="Enter Status"
            data={[
                { value: 'planned', label: 'Planned' },
                { value: 'ongoing', label: 'Ongoing' },
                { value: 'completed', label: 'Completed' },
              ]} 
            {...editForm.getInputProps("status")}
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

      {/* edit form details modal */}
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Edit site record"
      >
        <form onSubmit={editForm.onSubmit((values) => editSite(values))}>
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
            label="Address"
            placeholder="Enter Address"
            {...editForm.getInputProps("address")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter Phone"
            {...editForm.getInputProps("phone")}
            required
          />
          <TextInput
            placeholder="ManagerID"
            label="Enter ManagerID"
            {...editForm.getInputProps("manager")}
            disabled
            required
          />
          <Select
            label="Select Manager"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={managers}
            {...editForm.getInputProps("manager")}
            required
          />
            <Select
            placeholder="Status"
            label="Enter Status"
            data={[
                { value: 'planned', label: 'Planned' },
                { value: 'ongoing', label: 'Ongoing' },
                { value: 'completed', label: 'Completed' },
              ]} 
            {...editForm.getInputProps("status")}
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
            Add Site record
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
                  sorted={sortBy === "address"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("address")}
                >
                  Address
                </Th>
                <Th
                  sorted={sortBy === "phone"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("phone")}
                >
                  Phone
                </Th>
                <Th
                  sorted={sortBy === "manager"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("manager")}
                >
                  Manager
                </Th>
                <Th
                  sorted={sortBy === "status"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("status")}
                >
                  Status
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

export default ManageSites;
