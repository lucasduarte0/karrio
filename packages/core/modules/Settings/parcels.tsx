"use client";
import {
  ParcelEditModal,
  useParcelEditModal,
} from "@karrio/ui/core/modals/parcel-edit-modal";
import {
  useParcelTemplateMutation,
  useParcelTemplates,
} from "@karrio/hooks/parcel";
import { ConfirmModal, useConfirmModal } from "@karrio/ui/core/modals/confirm-modal";
import { ParcelDescription } from "@karrio/ui/core/components/parcel-description";
import { getURLSearchParams, isNoneOrEmpty } from "@karrio/lib";
import { useAPIMetadata } from "@karrio/hooks/api-metadata";
import { useLoader } from "@karrio/ui/core/components/loader";
import { AppLink } from "@karrio/ui/core/components/app-link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ParcelsPage(pageProps: any) {
  const Component = (): JSX.Element => {
    const { metadata } = useAPIMetadata();
    const searchParams = useSearchParams();
    const modal = searchParams.get("modal") as string;
    const { setLoading } = useLoader();
    const mutation = useParcelTemplateMutation();
    const { editParcel } = useParcelEditModal();
    const [initialized, setInitialized] = useState(false);
    const { confirm: confirmDeletion } = useConfirmModal();
    const {
      query: { data: { parcel_templates } = {}, ...query },
      filter,
      setFilter,
    } = useParcelTemplates({
      setVariablesToURL: true,
    });

    const remove = (id: string) => async () => {
      await mutation.deleteParcelTemplate.mutateAsync({ id });
    };
    const updateFilter = (extra: Partial<any> = {}) => {
      const query = {
        ...filter,
        ...getURLSearchParams(),
        ...extra,
      };

      setFilter(query);
    };

    useEffect(() => {
      updateFilter();
    }, [searchParams]);
    useEffect(() => {
      setLoading(query.isFetching);
    }, [query.isFetching]);
    useEffect(() => {
      if (query.isFetched && !initialized && !isNoneOrEmpty(modal)) {
        const parcelTemplate = (parcel_templates?.edges || []).find(
          (c) => c.node.id === modal,
        )?.node;
        if (parcelTemplate || modal === "new") {
          editParcel({ parcelTemplate } as any);
        }
        setInitialized(true);
      }
      query.isFetched && setInitialized(true);
    }, [modal, query.isFetched]);

    return (
      <>
        <header className="px-0 pb-0 pt-4 is-flex is-justify-content-space-between">
          <span className="title is-4">Settings</span>
          <div>
            <button
              className="button is-primary is-small is-pulled-right"
              onClick={() => editParcel()}
            >
              <span>Create parcel</span>
            </button>
          </div>
        </header>

        <div className="tabs">
          <ul>
            <li className={`is-capitalized has-text-weight-semibold`}>
              <AppLink
                href="/settings/account"
                shallow={false}
                prefetch={false}
              >
                <span>Account</span>
              </AppLink>
            </li>
            <li className={`is-capitalized has-text-weight-semibold`}>
              <AppLink
                href="/settings/profile"
                shallow={false}
                prefetch={false}
              >
                <span>Profile</span>
              </AppLink>
            </li>
            {metadata?.MULTI_ORGANIZATIONS && (
              <li className={`is-capitalized has-text-weight-semibold`}>
                <AppLink
                  href="/settings/organization"

                  shallow={false}
                  prefetch={false}
                >
                  <span>Organization</span>
                </AppLink>
              </li>
            )}
            <li className={`is-capitalized has-text-weight-semibold`}>
              <AppLink
                href="/settings/addresses"
                shallow={false}
                prefetch={false}
              >
                <span>Addresses</span>
              </AppLink>
            </li>
            <li className={`is-capitalized has-text-weight-semibold is-active`}>
              <AppLink
                href="/settings/parcels"
                shallow={false}
                prefetch={false}
              >
                <span>Parcels</span>
              </AppLink>
            </li>
            <li className={`is-capitalized has-text-weight-semibold`}>
              <AppLink
                href="/settings/templates"
                shallow={false}
                prefetch={false}
              >
                <span>Templates</span>
              </AppLink>
            </li>
          </ul>
        </div>

        {(parcel_templates?.edges || []).length > 0 && (
          <>
            <div className="table-container">
              <table className="table is-fullwidth">
                <tbody className="parcel-templates-table">
                  <tr>
                    <td className="template is-size-7">LABEL</td>
                    <td className="parcel is-size-7">PARCEL</td>
                    <td className="default is-size-7"></td>
                    <td className="action pr-0"></td>
                  </tr>

                  {(parcel_templates?.edges || []).map(({ node: template }) => (
                    <tr key={`${template.id}-${Date.now()}`}>
                      <td className="template is-vcentered is-size-7 has-text-weight-bold text-ellipsis">
                        <span className="text-ellipsis" title={template.label}>
                          {template.label}
                        </span>
                      </td>
                      <td className="parcel is-vcentered text-ellipsis">
                        <ParcelDescription parcel={template.parcel as any} />
                      </td>
                      <td className="default is-vcentered has-text-right">
                        {template.is_default && (
                          <span className="is-size-7 has-text-weight-semibold">
                            <span className="icon has-text-success">
                              <i className="fas fa-check"></i>
                            </span>{" "}
                            default
                          </span>
                        )}
                      </td>
                      <td className="action is-vcentered pr-0">
                        <div className="buttons is-justify-content-end">
                          <button
                            className="button is-white"
                            onClick={() =>
                              editParcel({
                                parcelTemplate: template as any,
                              })
                            }
                          >
                            <span className="icon is-small">
                              <i className="fas fa-pen"></i>
                            </span>
                          </button>
                          <button
                            className="button is-white"
                            onClick={() =>
                              confirmDeletion({
                                label: "Delete Parcel template",
                                identifier: template.id,
                                onConfirm: remove(template.id),
                              })
                            }
                          >
                            <span className="icon is-small">
                              <i className="fas fa-trash"></i>
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="px-2 py-2 is-vcentered">
              <span className="is-size-7 has-text-weight-semibold">
                {(parcel_templates?.edges || []).length} results
              </span>

              <div className="buttons has-addons is-centered is-pulled-right">
                <button
                  className="button is-small"
                  onClick={() =>
                    setFilter({ ...filter, offset: filter.offset || 0 - 20 })
                  }
                  disabled={filter.offset == 0}
                >
                  Previous
                </button>
                <button
                  className="button is-small"
                  onClick={() =>
                    setFilter({ ...filter, offset: filter.offset || 0 + 20 })
                  }
                  disabled={!parcel_templates?.page_info.has_next_page}
                >
                  Next
                </button>
              </div>
            </footer>
          </>
        )}

        {query.isFetched && (parcel_templates?.edges || [])?.length == 0 && (
          <div className="card my-6">
            <div className="card-content has-text-centered">
              <p>{`There aren't any results for that query.`}</p>
              <p>{`Create a new parcel`}</p>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <ConfirmModal>
        <ParcelEditModal>
          <Component />
        </ParcelEditModal>
      </ConfirmModal>
    </>
  );
}
