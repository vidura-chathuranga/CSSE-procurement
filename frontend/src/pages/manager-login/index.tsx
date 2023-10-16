import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
  } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import ManagerAPI from "../../api/ManagerAPI";
  import { showNotification, updateNotification } from "@mantine/notifications";
  import { IconCheck, IconAlertTriangle } from "@tabler/icons";
  
  function managerLogin(values: {
    email: string;
    password: string;
    remember: boolean;
  }): void {
    showNotification({
      id: "login-manager",
      loading: true,
      title: "Logging in...",
      message: "Please wait while we log you in to the manager dashboard",
      autoClose: false,
      disallowClose: true,
    });
  
    ManagerAPI.managerLogin(values.email, values.password)
      .then((response) => {
        updateNotification({
          id: "login-manager",
          color: "teal",
          title: "Logged in successfully",
          message:
            "You have been logged in successfully. Redirecting you to the manager dashboard...",
          icon: <IconCheck size={16} />,
          autoClose: 1000,
        });
        //add data to local storage
        localStorage.setItem("manager", JSON.stringify(response.data));
        //wait to notification to close and redirect to manager dashboard
        setTimeout(() => {
          if (response.data.role === "SITE_MANAGER") {
            window.location.href = "/site-manager/dashboard";
          } else if (response.data.role === "MANAGER") {
            window.location.href = "/manager/dashboard";
          }
        }, 1000);
      })
      .catch((error) => {
        updateNotification({
          id: "login-manager",
          color: "red",
          title: "Login failed",
          message:
            "We were unable to log you in. Please check your email and password and try again.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  }
  
  const ManagerLogin: React.FC = () => {
    if (localStorage.getItem("manager")) {
      if (
        JSON.parse(localStorage.getItem("manager") as string).role === "SITE_MANAGER"
      ) {
        window.location.href = "/site-manager/dashboard";
      } else {
        window.location.href = "/manager/dashboard";
      }
    }
  
    const form = useForm({
      validateInputOnChange: true,
      initialValues: { email: "", password: "", remember: false },
  
      validate: {
        email: (value) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          )
            ? null
            : "Invalid email",
      },
    });
  
    //set the page title
    document.title = "manager Login - Blood Bank Management System";
  
    return (
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Manager Login
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Enter your credentials to access the Manager dashboard
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit((values) => managerLogin(values))}>
            <TextInput
              label="Email"
              placeholder="you@example.dev"
              required
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps("password")}
            />
            <Group position="apart" mt="md">
              <Checkbox label="Remember me" {...form.getInputProps("remember")} />
              <Anchor<"a"> href="/manager-forget-password" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" type="submit">
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    );
  };
  
  export default ManagerLogin;
  