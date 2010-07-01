// ==========================================================================
// Project:   Todos.TaskDataSource
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

/** The sc_require() function before instructs the build system
 to make sure the models/task.js is loaded before this file
 so that Todos.Task is defined.
 */
sc_require('models/task');

/** @class
 This code defines the query object we will use in main().
 */
Todos.TASKS_QUERY = SC.Query.local(Todos.Task, {
    orderBy: 'isDone,description'
});

/** @class
 (Document Your Data Source Here)
 @extends SC.DataSource
 */
Todos.TaskDataSource = SC.DataSource.extend(
/** @scope Todos.TaskDataSource.prototype */
{

    // ..........................................................
    // QUERY SUPPORT
    // 
    //  fetch: function(store, query){
    //  
    //    // TODO: Add handlers to fetch data for specific queries.  
    //    // call store.dataSourceDidFetchQuery(query) when done.
    //    
    //    return NO; // return YES if you handled the query
    //  },
    /**
   * OK, now we are ready to write the fetch() method.
   * For this code we are going to use the new SC.Request provided by SproutCore,
   * which is a wrapper around XMLHttpRequest.
   * The fetch() method simply checks that the passed query object is the same TASKS_QUERY we defined earlier.
   * If it is, then it creates a new request to get /tasks, configures a callback for completion, and sends it.
   *
   * Note that fetch() will only load records when you use store.find(Todos.TASKS_QUERY) only.
   * Any other queries will be ignored by this data source.
   * This is how you can implement several data sources handling different types of queries.
   * 
   * Note that Firefox won't send 'application/json' in the accept header without the .header({'Accept': 'application/json'}) call
   * @param {Object} store
   * @param {Object} query
   */
    fetch: function(store, query) {
        console.log("fetch(store, query) called");
        console.log("store:");
        console.log("store");
        console.log("query");
        if (query === Todos.TASKS_QUERY) {
            SC.Request.getUrl('/tasks').header({
                'Accept': 'application/json'
            }).json().notify(this, 'didFetchTasks', store, query).send();
            console.log("fetch(store, query) returning YES");
            return YES;
        }
        console.log("fetch(store, query) returning NO");
        return NO;
    },

    /**
   * didFetchTasks() is called by the SC.Request object when a response arrives from the server.
   * The first parameter passed is the response object.
   * The other parameters are anything we passed to notify() (in this case 'store' and 'query') up above.
   *
   * This method simply loads any returned data into the store and then notifies the store that we have finished loading the query results.
   * This will update a status property on the query results you get from find() on the store.
   *
   * If the server returns an error for some reason, this code doesn't do much interesting.
   * It simply informs the store and exits.
   * In a shipping application you would probably want to make this more developed.
   * @param {Object} response
   * @param {Object} store
   * @param {Object} query
   */
    didFetchTasks: function(response, store, query) {
        console.log("didFetchTasks(response, store, query) called");
        console.log("response:");
        console.log(response);
        console.log("store:");
        console.log(store);
        console.log("query:");
        console.log(query);
        if (SC.ok(response)) {
            store.loadRecords(Todos.Task, response.get('body').content);
            store.dataSourceDidFetchQuery(query);
            console.log("store.dataSourceDidFetchQuery(query) was called");
        }
        else {
            store.dataSourceDidErrorQuery(query, response);
            console.log("store.dataSourceDidErrorQuery(query, response) was called");
        }
    },

    // ..........................................................
    // RECORD SUPPORT
    // 
    //  retrieveRecord: function(store, storeKey){
    //  
    //    // TODO: Add handlers to retrieve an individual record's contents
    //    // call store.dataSourceDidComplete(storeKey) when done.
    //    
    //    return NO; // return YES if you handled the storeKey
    //  },
    /**
 * Retrieving Records

Now that we can fetch all our tasks, we need to handle the other basic operations for records, 
including retrieving individual items.  
This code is almost identical to the fetch() method except the store will pass a single storeKey instead of a Query.  

The storeKey is a number assigned to each record when it loads into memory.  
It is temporal - that is it is regenerated each time you reload your app.  
You should never save storeKeys to your server, 
but you will need to use them to lookup the data you actually want to fetch or update.

Here is what the implementation of retrieveRecord() should look like:
 * @param {Object} store
 * @param {Object} storeKey
 */
    retrieveRecord: function(store, storeKey) {
        console.log("retrieveRecord(store, storeKey) called");
        console.log("store:");
        console.log(store);
        console.log("storeKey:");
        console.log(storeKey);
        if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
            var url = store.idFor(storeKey);
            SC.Request.getUrl(url).header({
                'Accept': 'application/json'
            }).json().notify(this, 'didRetrieveTask', store, storeKey).send();
            console.log("retrieveRecord(store, storeKey) returning YES");
            return YES;
        } else {
            console.log("retrieveRecord(store, storeKey) returning NO");
            return NO;
        }
    },

    didRetrieveTask: function(response, store, storeKey) {
        console.log("didRetrieveTask(response, store, storeKey) called");
        console.log("response:");
        console.log(response);
        console.log("store:");
        console.log(store);
        console.log("storeKey:");
        console.log(storeKey);
        if (SC.ok(response)) {
            var dataHash = response.get('body').content;
            store.dataSourceDidComplete(storeKey, dataHash);
            console.log("store.dataSourceDidComplete(storeKey, dataHash) was called");
        }
        else {
            store.dataSourceDidError(storeKey, response);
            console.log("store.dataSourceDidError(storeKey, response) was called");
        }
    },
    /**
This code work's much like fetch.  
First, retrieveRecord() makes sure the storeKey we are asked to retrieve is actually a Task.  
If it is, the method looks up the ID (which is the URL in our data model) and then issues a retrieve request.  
On response, didRetrieveTask() will notify the store that we have finished handling the storeKey, passing any dataHash.  
In the case of an error, we notify of an error as well.  

This is pretty simple.  It also won't be used often in our particular app because we load all the tasks up front, 
so let's implement the next one that is important: creating records.
 */

    //  createRecord: function(store, storeKey){
    //  
    //    // TODO: Add handlers to submit new records to the data source.
    //    // call store.dataSourceDidComplete(storeKey) when done.
    //    
    //    return NO; // return YES if you handled the storeKey
    //  },
    /**
 * Creating Records
Creating records is almost exactly like retrieving a record 
except that we need to send some data and deal with the 'Location' header the server will include in the response.  
Here's what the code looks like:
 * @param {Object} store
 * @param {Object} storeKey
 */
    createRecord: function(store, storeKey) {
        console.log("createRecord(store, storeKey) called");
        console.log("store:");
        console.log(store);
        console.log("storeKey:");
        console.log(storeKey);
        if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
            console.log("*** Sending store.readDataHash(storeKey):");
            console.log(store.readDataHash(storeKey));
            SC.Request.postUrl('/tasks').header({
                'Accept': 'application/json'
            }).json().notify(this, this.didCreateTask, store, storeKey).send(store.readDataHash(storeKey));
            console.log("createRecord(store, storeKey) returning YES");
            return YES;
        } else {
            console.log("createRecord(store, storeKey) returning NO");
            return NO;
        }
    },

    didCreateTask: function(response, store, storeKey) {
        console.log("didCreateTask(response, store, storeKey) called");
        console.log("response:");
        console.log(response);
        console.log("store:");
        console.log(store);
        console.log("storeKey:");
        console.log(storeKey);
        if (SC.ok(response)) {
            // Adapted from parseUri 1.2.2
            // (c) Steven Levithan <stevenlevithan.com>
            // MIT License
            var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
            var url = parser.exec(response.header('Location'))[8];
            store.dataSourceDidComplete(storeKey, null, url); // update url
            console.log("store.dataSourceDidComplete(storeKey, null, url) was called");
        } else {
            store.dataSourceDidError(storeKey, response);
            console.log("store.dataSourceDidError(storeKey, response) was called");
        }
    },
    /**
By now, the structure of these methods should look pretty familiar to you.  
Verify you can handle the storeKey, then create a new request to send to the server. 
In this case, we will POST to the /tasks URL to create the new task.  
We send the Task data hash as the body of the POST when we pass it to SC.Request#send().

Later, on response, we parse the location and get the relative part of the it in case it was an absolute URL. 
We then call dataSourceDidComplete(). Passing null as the second parameter tells the Store we don't have any new data to provide.  
passing the URL as the third parameter causes the store to remap the storeKey to the new ID.

You can actually test this code now.  Reload your app and try creating some new tasks.  
As soon as you add a new task, it should update on the server.  
Of course, changes to a record won't stick until we add the last few methods for updating and destroying records.
 */

    /**
 * Updating and Destroying Records 
 */
    //    updateRecord: function(store, storeKey) {
    //
    //        // TODO: Add handlers to submit modified record to the data source
    //        // call store.dataSourceDidComplete(storeKey) when done.
    //        return NO; // return YES if you handled the storeKey
    //    },
    /**
 * 
 * @param {Object} store
 * @param {Object} storeKey
 */
    // ..........................................................
    // UPDATE RECORDS
    // 
    updateRecord: function(store, storeKey) {
        console.log("updateRecord alled");
        if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
            var putUrl = SC.Request.putUrl(store.idFor(storeKey)).header({
                'Accept': 'application/json'
            }).json().notify(this, this.didUpdateTask, store, storeKey);
            console.log("putUrl:");
            console.log(putUrl);
            var sendResult = putUrl.send(store.readDataHash(storeKey));
            console.log("sendResult:");
            console.log(sendResult);
            console.log("updateRecord:return YES");
            return YES;
        } else {
            console.log("updateRecord:return NO");
            return NO;
        }
    },

    didUpdateTask: function(response, store, storeKey) {
        if (SC.ok(response)) {
            var data = response.get('body');
            if (data) {
                data = data.content; // if hash is returned; use it.
            }
            console.log("storing in client data:");
            console.log(data);
            store.dataSourceDidComplete(storeKey, data);
        } else {
            store.dataSourceDidError(storeKey);
        }
    },
    //    destroyRecord: function(store, storeKey) {
    //
    //        // TODO: Add handlers to destroy records on the data source.
    //        // call store.dataSourceDidDestroy(storeKey) when done
    //        return NO; // return YES if you handled the storeKey
    //    }
    // ..........................................................
    // DESTROY RECORDS
    // 
    /**
 * 
 * @param {Object} store
 * @param {Object} storeKey
 */
    destroyRecord: function(store, storeKey) {
        if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
            SC.Request.deleteUrl(store.idFor(storeKey)).header({
                'Accept': 'application/json'
            }).json().notify(this, this.didDestroyTask, store, storeKey).send();
            return YES;
        }
        else {
            return NO;
        }
    },

    didDestroyTask: function(response, store, storeKey) {
        if (SC.ok(response)) {
            store.dataSourceDidDestroy(storeKey);
        }
        else {
            store.dataSourceDidError(response);
        }
    }
    /**
These methods post updates and destroy methods.  
They always, always, callback to the store.  
With these items in place, your app should be fully functional with the server now.  
 
Put It All Together
That's it! You are done! You should be able to create a task by clicking the "Add task" button, 
remove a task by hitting the delete key, 
and update a task by double-clicking its description to enable the inline editor. 

Congratulations.  You've just built your first app on SproutCore!
 */

});
