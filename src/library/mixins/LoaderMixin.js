//this is a generic mixin to indicate loading??
export const LoaderMixin = {
  data: function () {
    return {
      _loading: false,//BOOLEAN TO FLAG component loading
      _error: false, //BOOLEAN TO FLAG component error
    }
  },

  computed: {
    isLoading: {
      get: function () {
        return this.$data._loading;
      },
      set: function (value) {
        this.$data._loading = value;
      }
    },
    isErrored: {
      get: function () {
        return this.$data._error;
      },
      set: function (value) {
        this.$data._error = value;
      }
    }
  },

}
