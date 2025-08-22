import { useEffect, useState, useCallback } from "react";
import {
  CircularProgress,
  Autocomplete,
  Typography,
  TextField,
  Stack,
  Alert,
  Avatar,
  Grid,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  SubmitHandler,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { NumericFormat } from "react-number-format";
import { fetchPrices, tokenIconUrl } from "../../utils/pricesAndTokens";
import validationSchema from "./valSchema";
import { VAR_NAME } from "./const";

export default function SwapForm() {
  type Inputs = {
    [VAR_NAME.SOURCE_CURRENCY]: string;
    [VAR_NAME.SOURCE_PRICE]: number;
    [VAR_NAME.TARGET_CURRENCY]: string;
  };
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [targetAmount, setTargetAmount] = useState<number>();

  const symbols = Object.keys(prices);
  const { watch, handleSubmit, control } = useForm<Inputs>({
    defaultValues: {
      [VAR_NAME.SOURCE_CURRENCY]: "",
      [VAR_NAME.TARGET_CURRENCY]: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPrices();
        setPrices(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load prices");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      const fromPrice = prices[data[VAR_NAME.SOURCE_CURRENCY]] || 0;
      const toPrice = prices[data[VAR_NAME.TARGET_CURRENCY]] || 0;
      const rate = fromPrice && toPrice ? fromPrice / toPrice : 0;
      setTargetAmount(data[VAR_NAME.SOURCE_PRICE] * rate);
    },
    [prices]
  );

  useEffect(() => {
    const subscription = watch(() => {
      handleSubmit(onSubmit)();
    });

    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, onSubmit, prices]);

  const CurrencyIcon = (currency: string) => {
    return (
      <Avatar
        src={tokenIconUrl(currency)}
        sx={{ width: 24, height: 24 }}
        alt={currency}
      />
    );
  };

  const CurrencySelect = <T extends FieldValues, N extends FieldPath<T>>(
    field: ControllerRenderProps<T, N>
  ) => {
    return (
      <Autocomplete
        options={symbols}
        value={field.value || null}
        onChange={(_, v) => field.onChange(v ?? "")}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select currency"
            slotProps={{
              input: {
                ...params.InputProps,
                inputProps: {
                  ...params.inputProps,
                },
                startAdornment: field.value ? (
                  <>
                    <InputAdornment position="start">
                      {CurrencyIcon(field.value)}
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ) : (
                  params.InputProps.startAdornment
                ),
                inputMode: "decimal",
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            <Stack direction="row" spacing={1} alignItems="center">
              {CurrencyIcon(option)}
              <Typography>{option}</Typography>
            </Stack>
          </li>
        )}
        autoHighlight
        openOnFocus
      />
    );
  };

  return (
    <>
      {loading ? (
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography>Loading token prices...</Typography>
        </Stack>
      ) : (
        <form>
          {error && (
            <Alert severity="error" sx={{ marginBottom: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Currency I have:
              </Typography>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Controller
                    name={VAR_NAME.SOURCE_CURRENCY}
                    control={control}
                    defaultValue=""
                    render={({ field }) => CurrencySelect(field)}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name={VAR_NAME.SOURCE_PRICE}
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        thousandSeparator
                        allowNegative={false}
                        decimalScale={4}
                        fixedDecimalScale={false}
                        value={field.value ?? ""}
                        onValueChange={(v) =>
                          field.onChange(v.floatValue ?? undefined)
                        }
                        customInput={TextField}
                        placeholder="Enter amount"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Currency I want:
              </Typography>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Controller
                    name={VAR_NAME.TARGET_CURRENCY}
                    control={control}
                    defaultValue=""
                    render={({ field }) => CurrencySelect(field)}
                  />
                </Grid>
                <Grid size={12}>
                  <NumericFormat
                    thousandSeparator
                    allowNegative={false}
                    decimalScale={4}
                    fixedDecimalScale={false}
                    value={targetAmount}
                    customInput={TextField}
                    placeholder="Your amount"
                    fullWidth
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
}
