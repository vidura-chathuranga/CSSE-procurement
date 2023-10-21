import { useState } from "react";
import {
  createStyles,
  Navbar,
  Group,
  Code,
  Box,
  Paper,
  Text,
  SimpleGrid,
} from "@mantine/core";
import {
  IconSettings,
  IconArticle,
  IconLogout,
  IconUserCheck,
  IconNotes,
} from "@tabler/icons";
import Logo from "../../assets/logo.png";
import { IconBackhoe, IconCircleCheck } from "@tabler/icons";
import SupplierHeader from "../SupplierHeader";
import ManageSupplierOrders from "../ManageSupplierOrders";

//Dashboard styles
const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
      marginBottom: theme.spacing.md,
      bottom: 0,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,
      cursor: "pointer",

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

// side nav bar data
const data = [{ link: "", label: "Orders", icon: IconArticle }];

export const SupplierDashboardComponent: React.FC = () => {
  const data = [
    {
      title: "On Going Sites",
      value: 5,
      icon: IconBackhoe,
    },
    {
      title: "Completed Sites",
      value: 5,
      icon: IconCircleCheck,
    },
    {
      title: "Suppliers",
      value: 5,
      icon: IconUserCheck,
    },
    {
      title: "Purchace Orders",
      value: 5,
      icon: IconNotes,
    },
  ];

  const stats = data.map((stat) => {
    return (
      <Paper withBorder radius="md" p="xs" key={stat.title}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <stat.icon size={150} />
          <Group
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "20px",
              textAlign: "center",
            }}
          >
            <Text
              weight={700}
              size="xl"
              sx={{ fontSize: "4rem", marginBottom: -30, marginTop: -30 }}
            >
              {stat.value}
            </Text>
            <Text color="dimmed" size="md" transform="uppercase" weight={700}>
              {stat.title}
            </Text>
          </Group>
        </Box>
      </Paper>
    );
  });
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        sx={{ width: "100%" }}
      >
        {stats}
      </SimpleGrid>
    </Box>
  );
};

// Manager dashboard
const SupplierDashboard: React.FC = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Billing");
  const [component, setComponent] = useState(
    <Box>
      <SupplierHeader componentName="Orders" />
      <Box>
        <ManageSupplierOrders />
      </Box>
    </Box>
  );

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        changeComponent(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  const changeComponent = (componentName: string) => {
    if (componentName === "Orders") {
      setComponent(
        <Box>
          <SupplierHeader componentName="Orders" />
          <Box>
            <ManageSupplierOrders />
          </Box>
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "start",
        width: "100%",
        height: "100%",
      }}
    >
      <Navbar height={"97vh"} width={{ sm: 300 }} p="md">
        <Navbar.Section grow>
          <Group className={classes.header} position="apart">
            <img src={Logo} alt="Logo" width="150" height="75" />
            <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
          </Group>
          {links}
        </Navbar.Section>

        {/* Nav bar setting section  */}
        <Navbar.Section className={classes.footer}>
          <p
            className={classes.link}
            onClick={() => {
              changeComponent("Settings");
            }}
          >
            <IconSettings className={classes.linkIcon} stroke={1.5} />
            <span>Settings</span>
          </p>
          <a href="/supplier/logout" className={classes.link}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </Navbar.Section>
      </Navbar>
      <Box
        sx={{
          width: "100%",
        }}
      >
        {component}
      </Box>
    </Box>
  );
};

export default SupplierDashboard;
