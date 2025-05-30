"use client";
import { ProfileUpdateInput } from "@karrio/ui/core/forms/profile-update-input";
import { PasswordManagement } from "@karrio/ui/core/forms/password-management";
import { EmailManagement } from "@karrio/ui/core/forms/email-management";
import { ConfirmModal } from "@karrio/ui/core/modals/confirm-modal";
import { AppLink } from "@karrio/ui/core/components/app-link";
import { useAPIMetadata } from "@karrio/hooks/api-metadata";


export default function AccountPage(pageProps: any) {
  const Component = (): JSX.Element => {
    const { metadata } = useAPIMetadata();
    return (
      <>
        <header className="px-0 pb-0 pt-4 is-flex is-justify-content-space-between">
          <span className="title is-4">Settings</span>
          <div></div>
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
            <li className={`is-capitalized has-text-weight-semibold is-active`}>
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
            <li className={`is-capitalized has-text-weight-semibold`}>
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

        <div>
          <div className="columns py-6 my-4">
            <div className="column is-5 pr-2">
              <p className="subtitle is-6 py-1">Profile</p>
              <p className="is-size-7 pr-2">
                Your email address is your identity on {metadata?.APP_NAME} and is used to
                log in.
              </p>
            </div>

            <div className="column is-4">
              <EmailManagement />
              <ProfileUpdateInput
                label="Name (Optional)"
                propertyKey="full_name"
                inputType="text"
              />
            </div>

            <div className="column is-3"></div>
          </div>

          <hr style={{ height: "1px" }} />

          <div className="columns py-6 my-4">
            <div className="column is-5 pr-6">
              <p className="subtitle is-6 py-1">Password</p>
              <p className="is-size-7 pr-6">You can change your password.</p>
            </div>

            <PasswordManagement />

            <div className="column is-3"></div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <ConfirmModal>
        <Component />
      </ConfirmModal>
    </>
  );
}
