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
  Flex,
  Textarea,
  Card,
  NumberInput,
  ActionIcon,
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
import { DatePicker } from "@mantine/dates";

//Interface for order data - (Raw data)
interface RowData {
  id: string;
  products: PurchaceOrderItems[];
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

//Interface for purchace order items
export interface PurchaceOrderItems {
  product: string;
  quantity: number;
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
    keys(data[0]).some((key) =>
      item[key].toString().toLowerCase().includes(query)
    )
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
      if (sortBy === "products") return 0;
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

  //Add form purchace order items list
  const [addFormPurchaceOrderItems, setAddFormPurchaceOrderItems] = useState<
    PurchaceOrderItems[]
  >([]);

  //Edit form purchace order items list
  const [editFormPurchaceOrderItems, setEditFormPurchaceOrderItems] = useState<
    PurchaceOrderItems[]
  >([]);

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
          products: item.products,
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
    products: PurchaceOrderItems[];
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
              products: values.products,
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
    products: PurchaceOrderItems[];
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
            products: values.products,
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
      products: editFormPurchaceOrderItems,
      deliveryDate: "",
      site: "",
      status: "",
      specialNotes: "",
      updatedBy: "",
    },

    // edit form validations
    validate: {
      deliveryDate: (value) =>
        /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? null
          : "Invalid date - date must be in YYYY-MM-DD format",
      specialNotes: (value) =>
        value.length < 2 ? "Special notes must be at least 2 characters" : null,
    },
  });

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      products: addFormPurchaceOrderItems,
      deliveryDate: "",
      site: "",
      status: "PLACED",
      specialNotes: "",
      updatedBy: "",
    },

    // add order form validations
    validate: {
      deliveryDate: (value) =>
        /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? null
          : "Invalid date - date must be in YYYY-MM-DD format",
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
      <td>{row.id.slice(0, 8).toUpperCase()}</td>
      <td>{sites.find((site) => site.value === row.site)?.label}</td>
      <td>{row.deliveryDate.slice(0, 10)}</td>
      <td>
        {row.products?.map((item) => (
          <div key={item.product}>
            {products.find((product) => product.value === item.product)?.label}{" "}
            - {item.quantity}
          </div>
        ))}
      </td>
      <td>
        {row.status === "PLACED" ? (
          <Badge color="blue">Placed</Badge>
        ) : row.status === "PENDING" ? (
          <Badge color="orange">Pending</Badge>
        ) : row.status === "APPROVED" ? (
          <Badge color="green">Confirmed</Badge>
        ) : row.status === "DISPATCHED" ? (
          <Badge color="yellow">Dispatched</Badge>
        ) : row.status === "DELIVERED" ? (
          <Badge color="teal">Delivered</Badge>
        ) : (
          <Badge color="red">Declined</Badge>
        )}
      </td>
      <td>{managers.find((manager) => manager.id === row.updatedBy)?.name}</td>
      <td>
        {/* Order edit button */}
        <Button
          color="teal"
          leftIcon={<IconEdit size={14} />}
          onClick={() => {
            setEditFormPurchaceOrderItems(row.products ? row.products : []);
            editForm.setValues({
              id: row.id,
              products: editFormPurchaceOrderItems,
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
        title="Create Purchase Order"
        size={"xl"}
        zIndex={2000}
      >
        <form onSubmit={addForm.onSubmit((values) => addOrder(values))}>
          <Flex direction={"column"} gap={"sm"}>
            <Flex justify={"space-between"}>
              <Select
                label="Select Site"
                placeholder="Pick one"
                searchable
                nothingFound="No options"
                data={sites}
                {...addForm.getInputProps("site")}
                w={"49%"}
              />
              <DatePicker
                label="Expeted Delivery Date"
                placeholder="Enter Delivery Date"
                inputFormat="YYYY-MM-DD"
                onChange={(value) => {
                  if (!value) return;
                  let newDate = new Date(value);
                  newDate.setDate(newDate.getDate() + 1);
                  addForm.setFieldValue(
                    "deliveryDate",
                    newDate.toISOString().slice(0, 10)
                  );
                }}
                //exclude dates before the current day
                excludeDate={(date) => date < new Date()}
                required
                w={"49%"}
              />
            </Flex>
            <Select
              label="Add product to the order"
              description="Select a product to add to the order. products and quantities can not be changed after the order is approved."
              placeholder="Pick one"
              searchable
              nothingFound="No options"
              data={products}
              onChange={(value) => {
                if (!value) return;
                const item = addFormPurchaceOrderItems.find(
                  (item) => item.product === value
                );
                if (item) return;
                const items = [
                  ...addFormPurchaceOrderItems,
                  {
                    product: value,
                    quantity: 1,
                  },
                ];
                setAddFormPurchaceOrderItems(items);
                addForm.setFieldValue("products", items);
              }}
            />
            {addFormPurchaceOrderItems.map((item, index) => (
              <Card key={index} pb={0} pt={0}>
                <Flex justify={"space-between"} align={"center"}>
                  <Select
                    label={index === 0 ? "Product" : ""}
                    data={products}
                    defaultValue={item.product}
                    required
                    disabled
                    w={"45%"}
                  />
                  <NumberInput
                    label={index === 0 ? "Quantity" : ""}
                    placeholder="Enter Quantity"
                    defaultValue={item.quantity}
                    min={1}
                    max={100}
                    required
                    onChange={(value) => {
                      if (!value) return;
                      const items = [...addFormPurchaceOrderItems];
                      items[index].quantity = value;
                      setAddFormPurchaceOrderItems(items);
                      addForm.setFieldValue("products", items);
                    }}
                    w={"45%"}
                  />
                  <ActionIcon
                    variant="transparent"
                    color="red"
                    onClick={() => {
                      const items = [...addFormPurchaceOrderItems];
                      items.splice(index, 1);
                      setAddFormPurchaceOrderItems(items);
                      addForm.setFieldValue("products", items);
                    }}
                    mt={index === 0 ? 24 : 0}
                  >
                    <IconTrash size={32} />
                  </ActionIcon>
                </Flex>
              </Card>
            ))}
            <Select
              placeholder="Status"
              label="Select Status"
              description="When you crete a new order, it will be in placed status by default."
              data={[
                { value: "PLACED", label: "Placed" },
                { value: "PENDING", label: "Pending" }, // Remove
                { value: "APPROVED", label: "Approved" }, // Remove
                { value: "DECLINED", label: "Declined" }, // Remove
                { value: "DISPATCHED", label: "Dispatched" }, // Remove
                { value: "DELIVERED", label: "Delivered" }, // Remove
                { value: "CANCELLED", label: "Cancelled" }, // Remove
              ]}
              {...addForm.getInputProps("status")}
              required
            />

            <Textarea
              label="Special Notes"
              placeholder="Enter Special Notes"
              description="Enter any special notes about the purchase order."
              minRows={2}
              maxRows={4}
              {...addForm.getInputProps("specialNotes")}
              required
            />
            <Button
              color="teal"
              sx={{ marginTop: "10px", width: "100%" }}
              type="submit"
            >
              Create
            </Button>
          </Flex>
        </form>
      </Modal>

      {/* edit order form modal */}
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Edit Purchase Order"
        size={"xl"}
        zIndex={2000}
      >
        <form onSubmit={editForm.onSubmit((values) => editOrder(values))}>
          <Flex justify={"space-between"}>
            <Select
              label="Select Site"
              placeholder="Pick one"
              searchable
              nothingFound="No options"
              data={sites}
              {...editForm.getInputProps("site")}
              w={"49%"}
            />
            <DatePicker
              label="Expeted Delivery Date"
              placeholder="Enter Delivery Date"
              inputFormat="YYYY-MM-DD"
              onChange={(value) => {
                if (!value) return;
                let newDate = new Date(value);
                newDate.setDate(newDate.getDate() + 1);
                editForm.setFieldValue(
                  "deliveryDate",
                  newDate.toISOString().slice(0, 10)
                );
              }}
              //exclude dates before the current day
              excludeDate={(date) => date < new Date()}
              defaultValue={new Date(editForm.values.deliveryDate)}
              required
              w={"49%"}
            />
          </Flex>
          <Select
            label="Add product to the order"
            description="Select a product to add to the order. products and quantities can not be changed after the order is approved."
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={products}
            onChange={(value) => {
              if (!value) return;
              const item = editFormPurchaceOrderItems.find(
                (item) => item.product === value
              );
              if (item) return;
              const items = [
                ...editFormPurchaceOrderItems,
                {
                  product: value,
                  quantity: 1,
                },
              ];
              setEditFormPurchaceOrderItems(items);
              editForm.setFieldValue("products", items);
            }}
          />
          {editFormPurchaceOrderItems.map((item, index) => (
            <Card key={index} pb={0} pt={0}>
              <Flex justify={"space-between"} align={"center"}>
                <Select
                  label={index === 0 ? "Product" : ""}
                  data={products}
                  defaultValue={item.product}
                  required
                  disabled
                  w={"45%"}
                />
                <NumberInput
                  label={index === 0 ? "Quantity" : ""}
                  placeholder="Enter Quantity"
                  defaultValue={item.quantity}
                  min={1}
                  max={100}
                  required
                  onChange={(value) => {
                    if (!value) return;
                    const items = [...editFormPurchaceOrderItems];
                    items[index].quantity = value;
                    setEditFormPurchaceOrderItems(items);
                    editForm.setFieldValue("products", items);
                  }}
                  w={"45%"}
                />
                <ActionIcon
                  variant="transparent"
                  color="red"
                  onClick={() => {
                    const items = [...editFormPurchaceOrderItems];
                    items.splice(index, 1);
                    setEditFormPurchaceOrderItems(items);
                    editForm.setFieldValue("products", items);
                  }}
                  mt={index === 0 ? 24 : 0}
                >
                  <IconTrash size={32} />
                </ActionIcon>
              </Flex>
            </Card>
          ))}
          <Select
            placeholder="Status"
            label="Select Status"
            description="When you crete a new order, it will be in placed status by default."
            data={[
              { value: "PLACED", label: "Placed" },
              { value: "PENDING", label: "Pending" }, // Remove
              { value: "APPROVED", label: "Approved" }, // Remove
              { value: "DECLINED", label: "Declined" }, // Remove
              { value: "DISPATCHED", label: "Dispatched" }, // Remove
              { value: "DELIVERED", label: "Delivered" }, // Remove
              { value: "CANCELLED", label: "Cancelled" }, // Remove
            ]}
            {...editForm.getInputProps("status")}
            required
          />
          <Textarea
            label="Special Notes"
            placeholder="Enter Special Notes"
            description="Enter any special notes about the purchase order."
            minRows={2}
            maxRows={4}
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
            Create Purchase Order
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
                  sorted={sortBy === "site"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("site")}
                >
                  Site
                </Th>
                <Th
                  sorted={sortBy === "deliveryDate"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("deliveryDate")}
                >
                  Expected Delivery Date
                </Th>
                <Th
                  sorted={sortBy === "products"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("products")}
                >
                  Products
                </Th>
                <Th
                  sorted={sortBy === "status"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("status")}
                >
                  Status
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
