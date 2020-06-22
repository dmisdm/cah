import React from "react";
import { useFormik } from "formik";
import { Typography, TextField, Box, Button } from "@material-ui/core";
import { Padding } from ".";
import { generateRandomPokemonName } from "../lib/namegen";
import { useUserStore } from "../state/user";
import { CardLayout } from "./CardLayout";
import { DarkTheme } from "../theme";
type Props = {
  onNext: (values: { name: string }) => void;
};
export const IntroCard = React.forwardRef<HTMLFormElement, Props>(
  function IntroCard(props: Props, ref) {
    const userStore = useUserStore();
    const [loadingName, setLoadingName] = React.useState(false);
    const formik = useFormik({
      initialValues: {
        name: userStore.name,
      },
      validate: ({ name }) => {
        return {
          ...(!(name && name.length) ? { name: "Name is required" } : {}),
        };
      },

      onSubmit: (values) => {
        props.onNext({ name: values.name });
      },
    });

    const generateRandomName = React.useCallback(() => {
      setLoadingName(true);
      fetch("http://api.urbandictionary.com/v0/random")
        .then((res) => res.json())
        .then((data) => {
          setLoadingName(false);
          if (
            data &&
            data.list instanceof Array &&
            data.list.length &&
            data.list[0] &&
            data.list[0].author
          ) {
            formik.setFieldValue("name", data.list[0].author);
          }
        })
        .catch(() => {
          setLoadingName(false);
        });
    }, [formik]);

    React.useEffect(() => {
      userStore.updateName(formik.values.name);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.name]);
    return (
      <DarkTheme>
        <CardLayout
          ref={ref}
          variant="black"
          onSubmit={formik.handleSubmit}
          heading={
            <>
              <Typography variant="h4">Cards Against Humanity</Typography>
              <Typography variant="subtitle1" style={{ whiteSpace: "nowrap" }}>
                welcome...welcome...
              </Typography>
            </>
          }
          body={
            <Box
              display="flex"
              flexDirection="column"
              height="100%"
              justifyContent="center"
              alignItems="center"
            >
              <Padding />
              <Typography variant="body2">
                ...what was your name again?
              </Typography>
              <Padding />
              <Box width="100%" maxWidth="20rem">
                <TextField
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  error={formik.touched.name && !!formik.errors.name}
                  helperText={
                    (formik.touched.name && formik.errors.name) || " "
                  }
                  fullWidth
                  variant="outlined"
                  placeholder="Enter or generate your name"
                  name="name"
                />
              </Box>

              <Button disabled={loadingName} onClick={generateRandomName}>
                Random name
              </Button>
            </Box>
          }
          footer={
            <Box
              display="flex"
              height="100%"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <Button type="submit" variant="contained" color="primary">
                Next
              </Button>
            </Box>
          }
        />
      </DarkTheme>
    );
  }
);
