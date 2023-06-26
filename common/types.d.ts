export type CDKContext = {
  appName: string;
  region: string;
  environment: string;
  branchName: string;
  accountNumber: string;
};

export type LambdaDefinition = {
  name: string;
  memoryMB?: number;
  timeoutMins?: number;
  environment?: {
    [key: string]: string;
  };
};

export type Book = {
    itemType: string;
    title: string;
    authors: string;
    average_rating: string;
    isbn: string;
    isbn13: string;
    language_code: string;
    num_pages: string;
    ratings_count: string;
    text_reviews_count: string;
    publication_date: string;
    publisher: string;
};

export type GetBooksParams = {
  getBooksInput: {
    nextToken?: string;
    title?: string;
  };
};

export type AddBookParams = {
  addBookInput: {
    title: string;
    authors: string;
    average_rating: string;
    isbn: string;
    isbn13: string;
    language_code: string;
    num_pages: string;
    ratings_count: string;
    text_reviews_count: string;
    publication_date: string;
    publisher: string;
  };
};

export type UpdateBookParams = {
  updateBookInput: {
    title: string;
    authors?: string;
    average_rating?: string;
    isbn?: string;
    isbn13?: string;
    language_code?: string;
    num_pages?: string;
    ratings_count?: string;
    text_reviews_count?: string;
    publication_date?: string;
    publisher?: string;
  };
};

export type DeleteBookParams = {
  deleteBookInput: {
    title: string;
  };
};
