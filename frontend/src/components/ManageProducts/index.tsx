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

//Interface for product data - (Raw data)
interface RowData {
  id: string;
  name: string;
  price: string;
  description: string;
  supplier: string;
  image: string;
}

//Interface for supplier data - (Raw data)
interface RowDataSupliers {
  value: string;
  label: string;
}


//Get all product records from the database
const getAllProducts = async () => {
  const response = await ManagerAPI.getProducts();
  const data = await response.data;
  return data;
};

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

const ManageProducts: React.FC = () => {

  // store details of the products 
  const [data, setData] = useState<RowData[]>([]);
  
  // controll the loading state of the fetching data
  const [loading, setLoading] = useState(true);

  // store and manage supplier details 
  const [suppliers, setSuppliers] = useState<RowDataSupliers[]>([]);

  // fetch product data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "product data is loading..",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllProducts();
      const data = result.map((item: any) => {
        return {
            id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            supplier: item.supplier,
            image: item.image,
        };
      });
      setData(data);

      const resultSuppliers = await getAllSuppliers();
      const suppliers = resultSuppliers.map((item: any) => {
        return {
            label: item.name,
            value: item._id,
        };
      });
      setSuppliers(suppliers);
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

  //edit product form
  const editProduct = async (values: {
    id: string;
    name: string;
    price: string;
    description: string;
    supplier: string;
    image: string;
  }) => {
    showNotification({
      id: "edit-product",
      loading: true,
      title: "Updating product of " + values.name,
      message: "Updating product record..",
      autoClose: true,
      disallowClose: true,
    });
    ManagerAPI.editProduct(values)
      .then((response) => {
        updateNotification({
          id: "edit-product",
          color: "teal",
          title: "product record updated successfully",
          message: "Updated product record of " + values.name,
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
                price: values.price,
                description: values.description,
                supplier: values.supplier,
                image: values.image,
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
          message: "We were unable to update product data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add product
  const addProduct = async (values: {
    name: string;
    price: string;
    description: string;
    supplier: string;
    image: string;
  }) => {
    showNotification({
      id: "add-product",
      loading: true,
      title: "Adding product record",
      message: "Please wait while we add product record..",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.addProduct(values)
      .then((response) => {
        updateNotification({
          id: "add-product",
          color: "teal",
          title: "product added successfully",
          message: "product data added successfully.",
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
            price: values.price,
            description: values.description,
            supplier: values.supplier,
            image: values.image,
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
          id: "add-product",
          color: "red",
          title: "Adding product failed",
          message: "We were unable to add the product to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete product
  const deleteProduct = async (id: string) => {
    showNotification({
      id: "delete-product",
      loading: true,
      title: "Deleting product",
      message: "Please wait while we delete the product record",
      autoClose: false,
      disallowClose: true,
    });
    ManagerAPI.deleteProduct(id)
      .then((response) => {
        updateNotification({
          id: "delete-product",
          color: "teal",
          title: "product record deleted successfully",
          message: "The product record has been deleted successfully",
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
          id: "delete-product",
          color: "red",
          title: "Deleting product record failed",
          message: "We were unable to delete the product record",
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
        price: "",
        description: "",
        supplier: "",
        image: "",
    },

    // edit product form validations
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
        price: "",
        description: "",
        supplier: "",
        image: "",
    },

    // add form validations
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
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
        deleteProduct(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{row.name}</td>
        <td>{row.price}</td>
        <td>{row.description}</td>
        <td>{suppliers.find((supplier) => supplier.value === row.supplier)?.label}</td>
      <td>
        <Button
          color="teal"
          leftIcon={<IconEdit size={14} />}
          onClick={() => {
            editForm.setValues({
              id: row.id,
              name: row.name,
                price: row.price,
                description: row.description,
                supplier: row.supplier,
                image: row.image,
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
      {/* Add form modal */}
      <Modal
        opened={opened}
        onClose={() => {
          addForm.reset();
          setOpened(false);
        }}
        title="Add product record"
      >
        <form onSubmit={addForm.onSubmit((values) => addProduct(values))}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...addForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Price"
            placeholder="Enter price"
            {...addForm.getInputProps("price")}
            required
          />
          <TextInput
            label="Description"
            placeholder="Enter "
            {...addForm.getInputProps("description")}
            required
          />
          <Select
            label="Select supplier"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={suppliers}
            {...addForm.getInputProps("supplier")}
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

      {/* edit form modal */}
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Edit product record"
      >
        <form onSubmit={editForm.onSubmit((values) => editProduct(values))}>
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
            label="Price"
            placeholder="Enter price"
            {...editForm.getInputProps("price")}
            required
          />
          <TextInput
            label="Description"
            placeholder="Enter description"
            {...editForm.getInputProps("description")}
            required
          />
          <TextInput
            placeholder="SupplierID"
            label="Enter supplierID"
            {...editForm.getInputProps("supplier")}
            disabled
            required
          />
          <Select
            label="Select supplier"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={suppliers}
            {...editForm.getInputProps("supplier")}
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

          {/* Search bar */}
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "300px" }}
          />

          {/* Add product button  */}
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{ width: "200px", marginRight: "20px" }}
            onClick={() => setOpened(true)}
          >
            Add product record
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
                  sorted={sortBy === "price"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("price")}
                >
                  Price
                </Th>
                <Th
                  sorted={sortBy === "description"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("description")}
                >
                  Description
                </Th>
                <Th
                  sorted={sortBy === "supplier"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("supplier")}
                >
                  Supplier
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

export default ManageProducts;
