"use client";

import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";

export default function ProfileErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Grid container>
      <Grid size={12}>
        <Typography>There Was an unexpected Issue</Typography>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
      </Grid>
    </Grid>
  );
}
