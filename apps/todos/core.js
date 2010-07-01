// ==========================================================================
// Project:   Todos
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Todos */

/** @namespace
 My cool new app.  Describe your application.
 
 @extends SC.Object
 */
Todos = SC.Application.create(/** @scope Todos.prototype */{

  NAMESPACE: 'Todos',
  VERSION: '0.1.0',
  
  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  //store: SC.Store.create().from(SC.Record.fixtures)
  /**
   * Switch on the DataSource
   
   Finally, before we can try out this data source, we need to tell the store we want to use it.
   You do this in your core.js file.
   Instead of passing 'SC.Record.fixtures' when you configure the store, you can pass the name of your new store instead.
   Since your store may not be defined just yet, we will simply pass the class name as a string:
   */
  store: SC.Store.create({
    commitRecordsAutomatically: YES
  }).from('Todos.TaskDataSource')
  /**
   While we are at it, the code above also turns on a useful option on the store called commitRecordsAutomatically.
   This will cause the store to notice any changes to our data and automatically notify the data source.
   Without this option, you would have to manually tell the store when you want modified records to be sent to the server.
   In a complex app, you will usually want to control this yourself but auto-commit is a great way to get started so we'll use it here.
   
   OK.  Your data source is all set.  Reload your app and make sure no errors are thrown.
   If you created any todos manually in your server while testing, you should now see them displayed.
   If not, your list might be empty.  But never fear, we are about to make the store handle the rest of our setup as well.
   
   NOTE: To get remote queries working you have to switch the following code
   (See "Local vs. Remote Queries" in DataStore About<http://wiki.sproutcore.com/DataStore-About> for a definition.
   In following this tutorial there is no need to use a remote query and therefore no need to make the changes outlined below
   and doing so without other changes will cause the Todos app to break).
   
   Todos.TASKS_QUERY = SC.Query.local(Todos.Task, {
   orderBy: 'isDone,description'
   });
   
   to
   
   Todos.TASKS_QUERY = SC.Query.remote(Todos.Task,
   orderBy: 'isDone,description'
   });
   
   and
   
   didFetchTasks: function(response, store, query) {
   if (SC.ok(response)) {
   store.loadRecords(Todos.Task, response.get('body').content);
   store.dataSourceDidFetchQuery(query);
   
   } else store.dataSourceDidErrorQuery(query, response);
   },
   
   to
   
   didFetchTasks: function(response, store, query)
   if (SC.ok(response)) {
   var storeKeys = store.loadRecords(Todos.Task, response.get('body').content);
   
   store.loadQueryResults(query, storeKeys);
   } else store.dataSourceDidErrorQuery(query, response);
   },
   */
  // TODO: Add global constants or singleton objects needed by your app here.

});
