const resolvers = require('../src/graphql/resolvers');

jest.mock('../src/config/supabase', () => {
  const mockFrom = jest.fn();
  return { from: mockFrom, __mockFrom: mockFrom };
});

const supabase = require('../src/config/supabase');

function chainMock(result) {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue(result),
    single: jest.fn().mockResolvedValue(result),
  };
  chain.order.mockResolvedValue(result);
  return chain;
}

describe('GraphQL resolvers', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches all books', async () => {
    const books = [{ id: '1', title: 'Test', author_id: 'a1', created_at: '2024-01-01' }];
    supabase.__mockFrom.mockReturnValue(chainMock({ data: books, error: null }));

    const result = await resolvers.Query.books();
    expect(result).toEqual(books);
  });

  it('fetches book by id', async () => {
    const book = { id: '1', title: 'Test', author_id: 'a1' };
    supabase.__mockFrom.mockReturnValue(chainMock({ data: book, error: null }));

    const result = await resolvers.Query.book(null, { id: '1' });
    expect(result).toEqual(book);
  });

  it('fetches all authors', async () => {
    const authors = [{ id: 'a1', name: 'Author', created_at: '2024-01-01' }];
    supabase.__mockFrom.mockReturnValue(chainMock({ data: authors, error: null }));

    const result = await resolvers.Query.authors();
    expect(result).toEqual(authors);
  });

  it('resolves book.author nested field', async () => {
    const author = { id: 'a1', name: 'Author' };
    supabase.__mockFrom.mockReturnValue(chainMock({ data: author, error: null }));

    const result = await resolvers.Book.author({ author_id: 'a1' });
    expect(result).toEqual(author);
  });

  it('resolves author.books nested field', async () => {
    const books = [{ id: '1', title: 'Book' }];
    const chain = chainMock({ data: books, error: null });
    chain.eq.mockResolvedValue({ data: books, error: null });
    supabase.__mockFrom.mockReturnValue(chain);

    const result = await resolvers.Author.books({ id: 'a1' });
    expect(result).toEqual(books);
  });

  it('creates author via mutation', async () => {
    const author = { id: 'a1', name: 'New Author', bio: '', created_at: '2024-01-01' };
    supabase.__mockFrom.mockReturnValue(chainMock({ data: author, error: null }));

    const result = await resolvers.Mutation.createAuthor(null, { name: 'New Author' });
    expect(result).toEqual(author);
  });

  it('creates book via mutation', async () => {
    const book = { id: '1', title: 'New Book', isbn: '123', author_id: 'a1' };
    supabase.__mockFrom.mockReturnValue(chainMock({ data: book, error: null }));

    const result = await resolvers.Mutation.createBook(null, {
      title: 'New Book',
      isbn: '123',
      authorId: 'a1',
    });
    expect(result).toEqual(book);
  });

  it('maps camelCase fields on Book', () => {
    expect(resolvers.Book.authorId({ author_id: 'x' })).toBe('x');
    expect(resolvers.Book.createdAt({ created_at: '2024' })).toBe('2024');
  });

  it('maps createdAt on Author', () => {
    expect(resolvers.Author.createdAt({ created_at: '2024' })).toBe('2024');
  });

  it('throws on database error', async () => {
    supabase.__mockFrom.mockReturnValue(chainMock({ data: null, error: { message: 'DB error' } }));

    await expect(resolvers.Query.books()).rejects.toThrow('DB error');
  });
});
