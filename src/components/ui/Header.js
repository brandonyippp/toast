import React from "react";
import { IconButton, AppBar, Toolbar, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {props.children}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
