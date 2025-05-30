"use client";
import {
  DocumentTemplateType,
  DOCUMENT_RELATED_OBJECTS,
  NotificationType,
  TemplateType,
} from "@karrio/types";
import {
  isEqual,
  isNoneOrEmpty,
  url$,
  validationMessage,
  validityCheck,
} from "@karrio/lib";
import {
  useDocumentTemplate,
  useDocumentTemplateMutation,
} from "@karrio/hooks/document-template";
import { TextAreaField } from "@karrio/ui/core/components/textarea-field";
import { InputField } from "@karrio/ui/core/components/input-field";
import { useNotifier } from "@karrio/ui/core/components/notifier";
import { DEFAULT_DOCUMENT_TEMPLATE } from "@karrio/lib/sample";
import React, { useEffect, useReducer, useState } from "react";
import { useLoader } from "@karrio/ui/core/components/loader";
import { AppLink } from "@karrio/ui/core/components/app-link";
import { useAPIMetadata } from "@karrio/hooks/api-metadata";
import { useSearchParams } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

type stateValue = string | boolean | string[] | Partial<TemplateType>;
const DEFAULT_STATE = {
  related_object: "order",
  template: DEFAULT_DOCUMENT_TEMPLATE,
};

function reducer(
  state: any,
  { name, value }: { name: string; value: stateValue },
) {
  switch (name) {
    case "partial":
      return { ...(value as TemplateType) };
    default:
      return { ...state, [name]: value };
  }
}

export default function DocumentTemplatePage(pageProps: any) {
  const Component = (): JSX.Element => {
    const loader = useLoader();
    const searchParams = useSearchParams();
    const id = searchParams.get("id") as string;
    const notifier = useNotifier();
    const { references } = useAPIMetadata();
    const [isNew, setIsNew] = useState<boolean>();
    const mutation = useDocumentTemplateMutation();
    const [template, dispatch] = useReducer(
      reducer,
      DEFAULT_STATE,
      () => DEFAULT_STATE,
    );
    const {
      query: { data: { document_template } = {}, ...query },
      docId,
      setDocId,
    } = useDocumentTemplate({
      setVariablesToURL: true,
      id: id as string,
    });

    const computeParams = (template: DocumentTemplateType) => {
      if (isNoneOrEmpty(template.related_object)) {
        return "";
      }
      return `?${template.related_object}s=sample`;
    };
    const handleChange = (event: React.ChangeEvent<any>) => {
      const target = event.target;
      let value = target.type === "checkbox" ? target.checked : target.value;
      let name: string = target.name;

      if (target.multiple === true) {
        value = Array.from(target.selectedOptions).map((o: any) => o.value);
      }

      dispatch({ name, value });
    };
    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      loader.setLoading(true);
      const { updated_at, ...data } = template;

      try {
        if (isNew) {
          const { create_document_template } =
            await mutation.createDocumentTemplate.mutateAsync(data);
          notifier.notify({
            type: NotificationType.success,
            message: `Document template created successfully`,
          });
          loader.setLoading(false);

          setDocId(create_document_template.template?.id as string);
        } else {
          await mutation.updateDocumentTemplate.mutateAsync(data);
          query.refetch();
          notifier.notify({
            type: NotificationType.success,
            message: `Document template updated successfully`,
          });
          loader.setLoading(false);
        }
      } catch (message: any) {
        notifier.notify({ type: NotificationType.error, message });
        loader.setLoading(false);
      }
    };

    useEffect(() => {
      setIsNew(docId === "new");
    }, [docId]);
    useEffect(() => {
      if (docId !== "new") {
        dispatch({ name: "partial", value: document_template as any });
      }
    }, [document_template]);

    return (
      <form onSubmit={handleSubmit} className="p-4">
        <div className="columns">
          <div className="column is-vcentered">
            <AppLink
              className="button is-small is-white"
              href="/settings/templates"
              style={{ borderRadius: "50%" }}
            >
              <span className="icon is-large">
                <i className="fas fa-lg fa-times"></i>
              </span>
            </AppLink>
            <span className="title is-6 has-text-weight-semibold px-2 py-3">
              Edit document template
            </span>
          </div>
          <div className="column is-flex is-justify-content-end">
            <a
              className={`button is-small is-primary mx-1 ${isNoneOrEmpty(template.id) ? "is-static" : ""}`}
              href={url$`${references.HOST}/documents/templates/${template.id}.${template.slug}${computeParams(template)}`}
              target="_blank"
              rel="noreferrer"
            >
              Preview Template
            </a>
            <button
              type="submit"
              className="button is-small is-success"
              disabled={
                loader.loading ||
                isEqual(template, document_template || DEFAULT_STATE)
              }
            >
              Save Template
            </button>
          </div>
        </div>

        <hr className="my-2" style={{ height: "1px" }} />

        <div className="columns m-0">
          <div className="column px-0 pb-4 is-relative">
            <InputField
              label="name"
              name="name"
              value={template.name as string}
              onChange={handleChange}
              placeholder="packing slip"
              className="is-small"
              required
            />

            <InputField
              label="slug"
              name="slug"
              value={template.slug as string}
              onInvalid={validityCheck(
                validationMessage("Please enter a valid slug"),
              )}
              onChange={validityCheck(handleChange)}
              placeholder="packing_slip"
              className="is-small"
              pattern="^[a-z0-9_]+$"
              required
            />

            <div className="field mb-2">
              <label
                className="label is-capitalized"
                style={{ fontSize: ".8em" }}
              >
                <span>Related Objects</span>
                <span className="icon is-small has-text-danger small-icon">
                  <i
                    className="fas fa-asterisk"
                    style={{ fontSize: ".7em" }}
                  ></i>
                </span>
              </label>

              <div className="control">
                <div className="select is-small is-fullwidth">
                  <select
                    name="related_object"
                    onChange={handleChange}
                    value={template?.related_object}
                    required
                  >
                    {DOCUMENT_RELATED_OBJECTS.map((obj) => (
                      <option key={obj} value={obj}>
                        {obj}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* @ts-ignore */}
            <TextAreaField
              label="description"
              name="description"
              value={template.description as string}
              onChange={handleChange}
              placeholder="Packing slip template"
              className="is-small"
            />

            <div className="box mt-5">
              <div className="content" style={{ fontSize: "90%" }}>
                <p className="is-size-6">
                  <strong>Editing your template</strong>
                </p>
                <p>
                  To edit your template, use HTML, CSS, and{" "}
                  <a
                    href="https://jinja.palletsprojects.com/en/3.0.x/templates/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Jinja variables</span>
                    <i className="fas fa-external-link-alt pl-2 is-size-7"></i>
                  </a>{" "}
                  for documents.
                </p>
                <p className="mt-2">
                  The template can be styled with{" "}
                  <a
                    href="https://bulma.io/documentation/helpers/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>bulma css framework</span>
                    <i className="fas fa-external-link-alt pl-2 is-size-7"></i>
                  </a>{" "}
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="p-3"></div>

          <div className="column px-0 is-9">
            <div className="card" style={{ borderRadius: 0 }}>
              {/* @ts-ignore */}
              <CodeMirror
                height="80vh"
                extensions={[html({})]}
                value={template.template as string}
                onChange={(value) => dispatch({ name: "template", value })}
              />
            </div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <>
      <Component />
    </>
  );
}
