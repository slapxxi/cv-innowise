export interface GraphQLError {
  message: string;
}

export interface GraphQLResponseError {
  message: string;
  response?: {
    errors: GraphQLError[];
    status?: number;
  };
}
