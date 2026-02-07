export function createAction<TInput, TResult>(config: {
  name: string;
  handler: (input: TInput) => Promise<TResult>;
}) {
  return async function action(input: TInput) {
    return await config.handler(input);
  };
}
