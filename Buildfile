# ===========================================================================
# Project:   Todos
# Copyright: ©2009 My Company, Inc.
# ===========================================================================

# Add initial buildfile information here
config :all, :required => :sproutcore


#proxy '/tasks', :to => 'todos.demo.sproutcore.com'
proxy "/tasks", :to => "localhost:3000"
