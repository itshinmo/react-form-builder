import { Stack } from "@mui/material";
import { Header } from "shared/components";
import { FormEditor } from "./components";
import {
  ModalManagerProvider,
  useAddModal,
  useDeleteModal,
  useEditModal,
} from "./modals";
import { FormStateManager } from "./state";
import * as sx from "./styles";
import { EMPTY_FORM_DATA } from "./types";

const FormBuilder = () => {
  const editModal = useEditModal();
  const deleteModal = useDeleteModal();
  const addModal = useAddModal();

  return (
    <Stack sx={sx.root} direction="column">
      <Header sx={sx.header} />

      <FormStateManager formData={EMPTY_FORM_DATA}>
        <ModalManagerProvider
          editModal={editModal}
          deleteModal={deleteModal}
          addModal={addModal}
        >
          <FormEditor sx={sx.editor} />
        </ModalManagerProvider>

        {addModal.render()}
        {editModal.render()}
        {deleteModal.render()}
      </FormStateManager>
    </Stack>
  );
};

export default FormBuilder;
