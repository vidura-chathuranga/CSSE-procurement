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

//Interface for order data - (Raw data)
interface RowData {
  id: string;
  product: string;
  quantity: string;
  deliveryDate: string;
  site: string;
  status: string;
  specialNotes: string;
  updatedBy: string;
}

//Interface for manager data - (Raw data)
interface RowDataManagers {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

//Interface for site data - (Raw data)
interface RowDataSites {
    label: string;
    value: string;
  }

  //Interface for product data - (Raw data)
interface RowDataProducts {
    label: string;
    value: string;
  }

//Get all order records from the database
const getAllOrders = async () => {
    const response = await ManagerAPI.getOrders();
    const data = response.data;
    return data;
};

//Get all product records from the database
const getAllProducts = async () => {
  const response = await ManagerAPI.getProducts();
  const data = await response.data;
  return data;
};

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

// Manage order compoenent
const ManageOrders: React.FC = () => {
  //holds the order details
  const [data, setData] = useState<RowData[]>([]);  

  //controll the loading state of the details
  const [loading, setLoading] = useState(true);  

  // holds the manager details state
  const [managers, setManagers] = useState<RowDataManagers[]>([]); 
  
  //holds site data state
  const [sites, setSites] = useState<RowDataSites[]>([]); 

   //holds the product data
  const [products, setProducts] = useState<RowDataProducts[]>([]);

  // fetch order data
  useEffect(() => {

    // define fetchData function
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "order data is loading..",
        autoClose: false,
        disallowClose: true,
      });

      const result = await getAllOrders();
      const data = result.map((item: any) => {
        return {
            id: item._id,
            product: item.product,
            quantity: item.quantity,
            deliveryDate: item.deliveryDate,
            site: item.site,
            status: item.status,
            specialNotes: item.specialNotes,
            updatedBy: item.updatedBy,
        };
      });
      setData(data);

      const resultManagers = await getAllManagers();
      const managers = resultManagers.map((item: any) => {
        return {
            id: item._id,
            name: item.name,
        };
      });
      setManagers(managers);

      const resultSites = await getAllSites();
      const sites = resultSites.map((item: any) => {
          return {
              label: item.name,
              value: item._id,
          };
      });
      setSites(sites);

      const resultProducts = await getAllProducts();
      const products = resultProducts.map((item: any) => {
          return {
              label: item.name,
              value: item._id,
          };
      });
      setProducts(products);
      
      const payload = {
        sortBy: null,
        reversed: false,
        search: "",
      };

      setSortedData(sortData(data, payload));
      setLoading(false);
      updateNotification({
          id: "loding-data",
          color: "teal",
          title: "Data loaded successfully",
          message:
              "You can now manage orders by adding, editing or deleting them.",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
      });
    };

    // call to fetchData function declared above, Then it will fetch all the data of the orders,managers,prodcuts and sites
    fetchData();
  }, []);

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  //edit order form
  const editOrder = async (values: {
    id: string;
    product: string;
    quantity: string;

    deliveryDate: string;
    site: string;
    status: string;
    specialNotes: string;
    updatedBy: string;
  }) => {
    showNotification({
      id: "edit-order",
      loading: true,
      title: "Updating order of " + values.id,
      message: "Updating order record..",
      autoClose: true,
      disallowClose: true,
    });
    const manager = JSON.parse(localStorage.getItem("manager") || "{}");
    const updatedBy = manager._id;
    values.updatedBy = updatedBy;
    ManagerAPI.editOrder(values)
      .then((response) => {
        editForm.reset();
        setEditOpened(false);
        const newData = data.map((item) => {
          if (item.id === values.id) {
            return {
              id: values.id,
                product: values.product,
                quantity: values.quantity,
                deliveryDate: values.deliveryDate,
                site: values.site,
                status: values.status,
                specialNotes: values.specialNotes,
                updatedBy: values.updatedBy,
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
        updateNotification({
          id: "edit-order",
          color: "teal",
          title: "order record updated successfully",
          message: "Updated order record of " + values.id,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      })
      .catch((error) => {
        updateNotification({
            id: "edit-order",
            color: "red",
            title: "Update failed",
            message: "We were unable to update order data.",
            icon: <IconAlertTriangle size={16} />,
            autoClose: 5000,
        });
      });
  };

  //add order
  const addOrder = async (values: {
    product: string;
    quantity: string;

    deliveryDate: string;
    site: string;
    status: string;
    specialNotes: string;
    updatedBy: string;

  }) => {
    showNotification({
      id: "add-order",
      loading: true,
      title: "Adding order record",
      message: "Please wait while we add order record..",
      autoClose: false,
      disallowClose: true,
    });

    // get the current logged manager details from the local Storage
    const manager = JSON.parse(localStorage.getItem("manager") || "{}");
    const updatedBy = manager._id;
    values.updatedBy = updatedBy;
    ManagerAPI.addOrder(values)
      .then((response) => {
        addForm.reset();
        setOpened(false);
        const newData = [
          ...data,
          {
            id: response.data._id,
            product: values.product,
            quantity: values.quantity,
            deliveryDate: values.deliveryDate,
            site: values.site,
            status: values.status,
            specialNotes: values.specialNotes,
            updatedBy: values.updatedBy,
          },
        ];
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setData(newData);
        setSortedData(sortData(newData, payload));
        updateNotification({
          id: "add-order",
          color: "teal",
          title: "order record added successfully",
          message: "Added order record of " + response.data._id,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      })
      .catch((error) => {
        updateNotification({
            id: "add-order",
            color: "red",
            title: "Add failed",
            message: "We were unable to add order data.",
            icon: <IconAlertTriangle size={16} />,
            autoClose: 5000,
        });
      });
  };

  //delete order
  const deleteOrder = async (id: string) => {
    showNotification({
      id: "delete-order",
      loading: true,
      title: "Deleting order",
      message: "Please wait while we delete the order record",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.deleteOrder(id)
      .then((response) => {
        updateNotification({
          id: "delete-order",
          color: "teal",
          title: "order record deleted successfully",
          message: "The order record has been deleted successfully",
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
          id: "delete-order",
          color: "red",
          title: "Deleting order record failed",
          message: "We were unable to delete the order record",
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
        product: "",
        quantity: "",
        deliveryDate: "",
        site: "",
        status: "",
        specialNotes: "",
        updatedBy: "",
    },

    // edit form validations
    validate: {
      quantity: (value) => 
        /^\d+$/.test(value) ? null : "Quantity must be a number",
      deliveryDate: (value) =>
        /^\d{4}-\d{2}-\d{2}$/.test(value) ? null : "Invalid date - date must be in YYYY-MM-DD format",
      specialNotes: (value) =>
        value.length < 2 ? "Special notes must be at least 2 characters" : null,
    },
  });

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
        product: "",
        quantity: "",
        deliveryDate: "",
        site: "",
        status: "",
        specialNotes: "",
        updatedBy: "",
    },

    // add order form validations
    validate: {
      quantity: (value) => 
        /^\d+$/.test(value) ? null : "Quantity must be a number",
      deliveryDate: (value) =>
        /^\d{4}-\d{2}-\d{2}$/.test(value) ? null : "Invalid date - date must be in YYYY-MM-DD format",
      specialNotes: (value) =>
        value.length < 2 ? "Special notes must be at least 2 characters" : null,
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
      title: "Delete this Order record?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this order record? This action cannot
          be undone.
        </Text>
      ),
      labels: { confirm: "Delete order record", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The order record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteOrder(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.id.slice(0, 8)}</td>
      <td>{products.find((product) => product.value === row.product)?.label}</td>
      <td>{row.quantity}</td>
      <td>{row.deliveryDate.slice(0, 10)}</td>
      <td>{sites.find((site) => site.value === row.site)?.label}</td>
      <td>{
        row.status === "placed" ? (
            <Badge color="blue">Placed</Badge>
        ) : row.status === "confirmed" ? (
            <Badge color="green">Confirmed</Badge>
        ) : row.status === "dispatched" ? (
            <Badge color="yellow">Dispatched</Badge>
        ) : row.status === "delivered" ? (
            <Badge color="teal">Delivered</Badge>
        ) : (
            <Badge color="red">Rejected</Badge>
        )
        }</td>
      <td>{row.specialNotes}</td>
      <td>{managers.find((manager) => manager.id === row.updatedBy)?.name}</td>
      <td>
        {/* Order edit button */}
        <Button
          color="teal"
          leftIcon={<IconEdit size={14} />}
          onClick={() => {
            editForm.setValues({
              id: row.id,
                product: row.product,
                quantity: row.quantity,
                deliveryDate: row.deliveryDate.slice(0, 10),
                site: row.site,
                status: row.status,
                specialNotes: row.specialNotes,
                updatedBy: row.updatedBy,
            });
            setEditOpened(true);
          }}
          sx={{ margin: "5px", width: "100px" }}
        >
          Edit
        </Button>

        {/* order delete button */}
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

      {/* Add order form modal */}
      <Modal
        opened={opened}
        onClose={() => {
          addForm.reset();
          setOpened(false);
        }}
        title="Add Order record"
      >
        <form onSubmit={addForm.onSubmit((values) => addOrder(values))}>
        <Select
            label="Select product"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={products}
            {...addForm.getInputProps("product")}
            required
          />
          <TextInput
            label="Quantity"
            placeholder="Enter Quantity"
            {...addForm.getInputProps("quantity")}
            required
          />
          <TextInput
            label="Delivery Date"
            placeholder="Enter Delivery Date"
            {...addForm.getInputProps("deliveryDate")}
            required
          />
          <Select
            label="Select Site"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={sites}
            {...addForm.getInputProps("site")}
            required
          />
          <Select
            placeholder="Status"
            label="Enter Status"
            data={[
              { value: 'placed', label: 'Placed' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'dispatched', label: 'Dispatched' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'rejected', label: 'Rejected' },
              ]} 
            {...addForm.getInputProps("status")}
            required
            />

            <TextInput
            placeholder="Special Notes"
            label="Enter Special Notes"
            {...addForm.getInputProps("specialNotes")}
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

      {/* edit order form modal */}
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Edit product record"
      >
        <form onSubmit={editForm.onSubmit((values) => editOrder(values))}>
          <TextInput
            label="ID"
            placeholder="Enter ID"
            disabled
            {...editForm.getInputProps("id")}
            required
          />
          <Select
            label="Select product"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={products}
            {...editForm.getInputProps("product")}
            required
          />
          <TextInput
            label="Quantity"
            placeholder="Enter Quantity"
            {...editForm.getInputProps("quantity")}
            required
          />
          <TextInput
            label="Delivery Date"
            placeholder="Enter Delivery Date"
            {...editForm.getInputProps("deliveryDate")}
            required
          />
          <Select
            label="Select Site"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={sites}
            {...editForm.getInputProps("site")}
            required
          />
          <Select
            placeholder="Status"
            label="Enter Status"
            data={[
                { value: 'placed', label: 'Placed' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'dispatched', label: 'Dispatched' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'rejected', label: 'Rejected' },
              ]} 
            {...editForm.getInputProps("status")}
            required
            />

            <TextInput
            placeholder="Special Notes"
            label="Enter Special Notes"
            {...editForm.getInputProps("specialNotes")}
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
            Add Order record
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
                  sorted={sortBy === "product"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("product")}
                >
                  Product
                </Th>
                <Th
                  sorted={sortBy === "quantity"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("quantity")}
                >
                  Quantity
                </Th>
                <Th
                  sorted={sortBy === "deliveryDate"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("deliveryDate")}
                >
                  Delivery Date
                </Th>
                <Th
                  sorted={sortBy === "site"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("site")}
                >
                  Site
                </Th>
                <Th
                  sorted={sortBy === "status"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("status")}
                >
                  Status
                </Th>
                <Th
                  sorted={sortBy === "specialNotes"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("specialNotes")}
                >
                  Special Notes
                </Th>
                <Th
                  sorted={sortBy === "updatedBy"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("updatedBy")}
                >
                  Updated By
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

export default ManageOrders;
