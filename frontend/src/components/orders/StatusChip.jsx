import React from "react";
import { Chip } from "@mui/material";
import {
  Pending,
  Inventory,
  LocalShippingOutlined,
  CheckCircle,
  CancelOutlined,
  ShoppingBag
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

const StyledStatusChip = styled(Chip)(({ theme, statuscolor }) => ({
  fontWeight: 600,
  padding: theme.spacing(1, 1.5),
  borderRadius: 12,
  "& .MuiChip-label": {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
  ...(statuscolor === "warning" && {
    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.15)} 0%, ${alpha(theme.palette.warning.light, 0.25)} 100%)`,
    color: theme.palette.warning.dark,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
  }),
  ...(statuscolor === "info" && {
    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.15)} 0%, ${alpha(theme.palette.info.light, 0.25)} 100%)`,
    color: theme.palette.info.dark,
    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
  }),
  ...(statuscolor === "primary" && {
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.light, 0.25)} 100%)`,
    color: theme.palette.primary.dark,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  }),
  ...(statuscolor === "success" && {
    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.success.light, 0.25)} 100%)`,
    color: theme.palette.success.dark,
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
  }),
}));

const StatusChip = ({ status, size = "medium" }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "warning";
      case "confirmed": return "info";
      case "processing": return "info";
      case "shipped": return "primary";
      case "delivered": return "success";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return <Pending sx={{ fontSize: 18 }} />;
      case "confirmed":
      case "processing": return <Inventory sx={{ fontSize: 18 }} />;
      case "shipped": return <LocalShippingOutlined sx={{ fontSize: 18 }} />;
      case "delivered": return <CheckCircle sx={{ fontSize: 18 }} />;
      case "cancelled": return <CancelOutlined sx={{ fontSize: 18 }} />;
      default: return <ShoppingBag sx={{ fontSize: 18 }} />;
    }
  };

  return (
    <StyledStatusChip
      icon={getStatusIcon(status)}
      label={status?.toUpperCase() || "PENDING"}
      statuscolor={getStatusColor(status)}
      size={size}
    />
  );
};

export default StatusChip;