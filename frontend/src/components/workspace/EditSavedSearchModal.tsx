"use client";

import clsx from "clsx";
import { useClientFetch } from "src/hooks/useClientFetch";
import { useIsSSR } from "src/hooks/useIsSSR";
import { useUser } from "src/services/auth/useUser";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import {
  Button,
  ErrorMessage,
  FormGroup,
  Modal,
  ModalFooter,
  ModalHeading,
  ModalRef,
  ModalToggleButton,
  TextInput,
} from "@trussworks/react-uswds";

import { LoadingButton } from "src/components/LoadingButton";
import SimplerAlert from "src/components/SimplerAlert";
import { USWDSIcon } from "src/components/USWDSIcon";

function SaveSearchInput({
  validationError,
  updateSavedSearchName,
  id,
  defaultValue = "",
}: {
  validationError?: string;
  updateSavedSearchName: (name: string) => void;
  id: string;
  defaultValue?: string;
}) {
  const t = useTranslations("Search.saveSearch.modal");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormGroup error={!!validationError}>
      <label htmlFor="saved-search-input">
        {t.rich("inputLabel", {
          required: (chunks) => (
            <span className="usa-hint usa-hint--required">{chunks}</span>
          ),
        })}
      </label>
      {validationError && <ErrorMessage>{validationError}</ErrorMessage>}
      <div className="usa-search usa-search--big" role="search">
        <TextInput
          ref={inputRef}
          className={clsx("usa-input", "maxw-none", {
            "usa-input--error": !!validationError,
          })}
          id={`edit-saved-search-input-${id}`}
          name={`edit-saved-search-${id}`}
          defaultValue={defaultValue}
          onChange={(e) => updateSavedSearchName(e.target?.value)}
          type="text"
          required
          aria-required
        />
      </div>
    </FormGroup>
  );
}

function SuccessContent({
  modalRef,
  modalId,
  onClose,
}: {
  modalRef: RefObject<ModalRef | null>;
  modalId: string;
  onClose: () => void;
}) {
  const t = useTranslations("SavedSearches.editModal");
  return (
    <>
      <ModalHeading id={`${modalId}-heading`}>{t("successTitle")}</ModalHeading>
      <ModalFooter>
        <ModalToggleButton
          modalRef={modalRef}
          closer
          unstyled
          className="padding-105 text-center"
          onClick={onClose}
        >
          {t("closeText")}
        </ModalToggleButton>
      </ModalFooter>
    </>
  );
}

export function EditSavedSearchModal({
  savedSearchId,
  editText,
  queryName,
}: {
  savedSearchId: string;
  editText: string;
  queryName: string;
}) {
  const modalId = useMemo(
    () => `edit-save-search-${savedSearchId}`,
    [savedSearchId],
  );

  const t = useTranslations("SavedSearches.editModal");
  const modalRef = useRef<ModalRef>(null);
  const { user } = useUser();
  // The Modal component throws an error during SSR unless we specify that it should not "render to portal"
  // this hook allows us to opt out of that rendering behavior on the server
  const isSSR = useIsSSR();
  const { clientFetch } = useClientFetch<Response>(
    "Error updating saved search",
    { jsonResponse: false, authGatedRequest: true },
  );
  const router = useRouter();

  const [validationError, setValidationError] = useState<string>();
  const [savedSearchName, setSavedSearchName] = useState<string>();
  const [apiError, setApiError] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [updated, setUpdated] = useState<boolean>();

  const handleSubmit = useCallback(() => {
    if (validationError) {
      setValidationError(undefined);
    }
    if (!savedSearchName) {
      setValidationError(t("emptyNameError"));
      return;
    }
    if (!user?.token) return;
    setLoading(true);
    clientFetch("/api/user/saved-searches", {
      method: "PUT",
      body: JSON.stringify({ name: savedSearchName, searchId: savedSearchId }),
    })
      .then(() => {
        setUpdated(true);
        router.refresh();
      })
      .catch((error) => {
        setApiError(true);
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    savedSearchName,
    t,
    user?.token,
    validationError,
    savedSearchId,
    clientFetch,
    router,
  ]);

  const onClose = useCallback(() => {
    setUpdated(false);
    setApiError(false);
    setLoading(false);
    setValidationError(undefined);
    setSavedSearchName("");
  }, []);

  return (
    <>
      <ModalToggleButton
        modalRef={modalRef}
        opener
        data-testid={`open-edit-saved-search-modal-button-${savedSearchId}`}
        type="button"
        className="padding-1 hover:bg-base-lightest"
        unstyled
      >
        <USWDSIcon name="edit" key="edit-saved-search" />
        {editText}
      </ModalToggleButton>
      <Modal
        renderToPortal={!isSSR}
        ref={modalRef}
        forceAction
        className="text-wrap"
        aria-labelledby={`${modalId}-heading`}
        aria-describedby={`${modalId}-description`}
        id={modalId}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      >
        {updated ? (
          <SuccessContent
            modalRef={modalRef}
            modalId={modalId}
            onClose={onClose}
          />
        ) : (
          <>
            <ModalHeading id={`${modalId}-heading`}>
              {t("title")} {queryName}
            </ModalHeading>
            <>
              {apiError && (
                <SimplerAlert
                  alertClick={() => setApiError(false)}
                  buttonId={`editSavedSearchApiError-${savedSearchId}`}
                  messageText={t("apiError")}
                  type="error"
                />
              )}
              <SaveSearchInput
                validationError={validationError}
                updateSavedSearchName={setSavedSearchName}
                id={savedSearchId}
                defaultValue={queryName}
              />
              <ModalFooter>
                {loading ? (
                  <LoadingButton
                    id={`edit-saved-search-button-${savedSearchId}`}
                    message={t("loading")}
                  />
                ) : (
                  <>
                    <Button
                      type={"button"}
                      onClick={handleSubmit}
                      data-testid={`edit-saved-search-button-${savedSearchId}`}
                    >
                      {t("saveText")}
                    </Button>
                    <ModalToggleButton
                      modalRef={modalRef}
                      closer
                      unstyled
                      className="padding-105 text-center"
                      onClick={onClose}
                    >
                      {t("cancelText")}
                    </ModalToggleButton>
                  </>
                )}
              </ModalFooter>
            </>
          </>
        )}
      </Modal>
    </>
  );
}
