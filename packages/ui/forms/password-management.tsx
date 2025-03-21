import { ChangePasswordMutationInput, NotificationType } from '@karrio/types';
import React, { FormEvent, useContext, useReducer } from 'react';
import { ButtonField } from '../components/button-field';
import { InputField } from '../components/input-field';
import { useUserMutation } from '@karrio/hooks/user';
import { Notify } from '../components/notifier';
import { Loading } from '../components/loader';
import { isNone } from '@karrio/lib';

const DEFAULT_VALUE: Partial<ChangePasswordMutationInput> = {
  old_password: "",
  new_password1: "",
  new_password2: "",
};

function reducer(state: Partial<ChangePasswordMutationInput>, { name, value }: { name: string, value: string | object }) {
  switch (name) {
    case "full":
      return { ...(value as object) };
    case "partial":
      return { ...state, ...(value as object) };
    default:
      return { ...state, [name]: value };
  }
}

export const PasswordManagement= (): JSX.Element =>  {
  const mutation = useUserMutation();
  const { notify } = useContext(Notify);
  const { loading, setLoading } = useContext(Loading);
  const [data, dispatch] = useReducer(reducer, DEFAULT_VALUE, () => DEFAULT_VALUE);
  const { changePassword: { error, mutateAsync } } = useUserMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    const name: string = event.target.name;

    dispatch({ name, value });
  };
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await mutateAsync(data as ChangePasswordMutationInput);

      dispatch({ name: 'full', value: DEFAULT_VALUE });
      notify({ type: NotificationType.success, message: `Password changed successfully.` });
    } catch (error: any) {
      console.log(error)
    }
    setLoading(false);
  };
  const isDisabled = (data: Partial<ChangePasswordMutationInput>) => {
    return (Object
      .keys(data) as (keyof ChangePasswordMutationInput)[])
      .filter(key => !isNone(data[key]) && (data[key] || '').length > 0)
      .length !== 3;
  }
  const renderFieldError = (field: string, errorData: any) => {
    const validation = (errorData?.data?.errors || [])[0]?.validation || {};
    return (<>
      {Object.entries(validation)
        .filter(([key, _]) => key === field)
        .map(([_, messages]: any) => (
          messages.map((message: string, index: number) =>
            <p key={index} className="has-text-danger is-size-7 my-1">{message}</p>)
        ))}
    </>);
  }

  return (
    <form method="post" onSubmit={onSubmit} className="column">

      <InputField
        label="Current Password" name="old_password" type="password"
        placeholder="Current Password" className="is-small" wrapperClass="mt-3"
        onChange={handleChange} value={data.old_password} required>
        {renderFieldError("old_password", error)}
      </InputField>

      <hr style={{ height: "1px" }} />

      <InputField
        label="New Password" name="new_password1" type="password"
        placeholder="New Password" className="is-small" wrapperClass="mt-3"
        onChange={handleChange} value={data.new_password1} required>
        {renderFieldError("new_password1", error)}
      </InputField>

      <InputField
        label="Confirm New Password" name="new_password2" type="password"
        placeholder="Confirm Password" className="is-small" wrapperClass="mt-3"
        onChange={handleChange} value={data.new_password2} required>
        {renderFieldError("new_password2", error)}
      </InputField>


      <ButtonField type="submit"
        className={`is-default is-small ${loading ? 'is-loading' : ''} mt-4`}
        disabled={isDisabled(data)}>
        <span>Change my password</span>
      </ButtonField>

    </form>
  )
};
