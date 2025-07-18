export interface GraphQLError {
  message: string;
}

export interface GraphQLResponseError {
  response?: {
    errors: GraphQLError[];
    status?: number;
  };
  message: string;
}
