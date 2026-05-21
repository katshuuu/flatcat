const supabase = require('../config/supabase');

const resolvers = {
  Query: {
    books: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },

    book: async (_, { id }) => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },

    authors: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },

    author: async (_, { id }) => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  },

  Book: {
    authorId: (parent) => parent.author_id,
    createdAt: (parent) => parent.created_at,
    author: async (parent) => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', parent.author_id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  },

  Author: {
    createdAt: (parent) => parent.created_at,
    books: async (parent) => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('author_id', parent.id);
      if (error) throw new Error(error.message);
      return data;
    },
  },

  Mutation: {
    createBook: async (_, { title, isbn, year, authorId }) => {
      const { data, error } = await supabase
        .from('books')
        .insert({ title, isbn, year, author_id: authorId })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },

    createAuthor: async (_, { name, bio }) => {
      const { data, error } = await supabase
        .from('authors')
        .insert({ name, bio: bio || '' })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
  },
};

module.exports = resolvers;
