import React, { useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  Close as CloseIcon,
  Book as BookIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const EditCourseModal = ({ isOpen, onClose, course, onSave }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Prevent rendering if modal is not open or course is invalid
  if (!isOpen || !course || typeof course !== "object") {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCourse = {
      ...course,
      titre: e.target.titre?.value || course.titre || "",
      description: e.target.description?.value || course.description || "",
    };
    if (onSave && typeof onSave === "function") {
      onSave(updatedCourse);
    }
    onClose();
  };

  const handleClose = () => {
    if (onClose && typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { bgcolor: "rgba(0, 0, 0, 0.8)" },
        },
      }}
      aria-labelledby="modal-headline"
    >
      <Fade in={isOpen}>
        <Box
          ref={modalRef}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 450 },
            maxWidth: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            overflow: "hidden",
            outline: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: "primary.main",
              p: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <BookIcon sx={{ color: "white" }} />
              <Typography
                id="modal-headline"
                variant="h6"
                sx={{ color: "white", fontWeight: 600 }}
              >
                Edit Course
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{ color: "white", "&:hover": { bgcolor: "primary.dark" } }}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form body */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 3,
              bgcolor: "grey.50",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              id="titre"
              name="titre"
              label="Course Title"
              defaultValue={course.titre || ""}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: <BookIcon sx={{ color: "grey.400" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            <TextField
              id="description"
              name="description"
              label="Description"
              defaultValue={course.description || ""}
              multiline
              rows={5}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Box sx={{ alignSelf: "flex-start", pt: 1 }}>
                    <BookIcon sx={{ color: "grey.400" }} />
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                pt: 2,
                borderTop: 1,
                borderColor: "grey.200",
              }}
            >
              <Button
                onClick={handleClose}
                variant="outlined"
                startIcon={<CloseIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  color: "text.primary",
                  borderColor: "grey.300",
                  "&:hover": { bgcolor: "grey.100", borderColor: "grey.400" },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditCourseModal;
