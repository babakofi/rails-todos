class TasksController < ApplicationController
  # GET /tasks
  # GET /tasks.xml
  #  def index
  #    @tasks = Task.all
  #
  #    respond_to do |format|
  #      format.html # index.html.erb
  #      format.xml  { render :xml => @tasks }
  #    end
  #  end
  #Writing the controller
  #Open the file app/controllers/tasks_controllers.rb, and modify the index method like this:
  def index
    @tasks = Task.all
    
    respond_to do |format|
      tasks = @tasks.map {|task| json_for_task(task) }
      format.json { render :json => { :content => tasks } }
      format.html
      format.xml  { render :xml => @tasks }
    end
  end
  
  
  # GET /tasks/1
  # GET /tasks/1.xml
  #  def show
  #    @task = Task.find(params[:id])
  #    
  #    respond_to do |format|
  #      format.html # show.html.erb
  #      format.xml  { render :xml => @task }
  #    end
  #  end
  #Read or GET Task
  def show
    @task = Task.find(params[:id])
    
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @task }
      format.json do
        render :json => {
          :content => json_for_task(@task),
          :location => task_path(@task)
        }
      end
    end
  end
  
  
  # GET /tasks/new
  # GET /tasks/new.xml
  def new
    @task = Task.new
    
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @task }
    end
  end
  
  # GET /tasks/1/edit
  def edit
    @task = Task.find(params[:id])
  end
  
  # POST /tasks
  # POST /tasks.xml
  #  def create
  #    @task = Task.new(params[:task])
  #    
  #    respond_to do |format|
  #      if @task.save
  #        format.html { redirect_to(@task, :notice => 'Task was successfully created.') }
  #        format.xml  { render :xml => @task, :status => :created, :location => @task }
  #      else
  #        format.html { render :action => "new" }
  #        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
  #      end
  #    end
  #  end
  #Create Task
  def create
    @task = Task.new(params[:task])
    
    respond_to do |format|
      if @task.save
        flash[:notice] = 'Task was successfully created.'
        format.json do
          render :json => { :content => json_for_task(@task) }, :status => :created,
                            :location => task_path(@task)
        end
        format.html { redirect_to(@task) }
        format.xml  { render :xml => @task, :status => :created, :location => @task }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # PUT /tasks/1
  # PUT /tasks/1.xml
  #  def update
  #    @task = Task.find(params[:id])
  #    
  #    respond_to do |format|
  #      if @task.update_attributes(params[:task])
  #        format.html { redirect_to(@task, :notice => 'Task was successfully updated.') }
  #        format.xml  { head :ok }
  #      else
  #        format.html { render :action => "edit" }
  #        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
  #      end
  #    end
  #  end
  #Update Task
  def update
    puts "update called"
    puts "params:"
    puts params
    puts "params[:id]:"
    puts params[:id]
    @task = Task.find(params[:id])
    puts "found @task:"
    puts @task
    
    respond_to do |format|
      #puts "params[:task]:"
      #puts params[:task]
      #params[:task].delete(:guid)
      
      # Remove attributes that are not in a task or are not allowed to be mutated
      params.delete(:action)
      params.delete(:id)      
      params.delete(:controller)
      params.delete(:guid)
      
      puts "params:"
      puts params
      #if @task.update_attributes(params[:task])
      if @task.update_attributes(params)
        puts "updated @task:"
        puts @task
        flash[:notice] = 'Task was successfully updated.'
        format.json do
          render :json => { :content => json_for_task(@task) }, :location => task_path(@task)
        end
        format.html { redirect_to(@task) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  
  # DELETE /tasks/1
  # DELETE /tasks/1.xml
  #  def destroy
  #    @task = Task.find(params[:id])
  #    @task.destroy
  #    
  #    respond_to do |format|
  #      format.html { redirect_to(tasks_url) }
  #      format.xml  { head :ok }
  #    end
  #  end
  #Delete Task
  def destroy
    @task = Task.find(params[:id])
    @task.destroy
    
    respond_to do |format|
      format.json { head :ok }
      format.html { redirect_to(tasks_url) }
      format.xml  { head :ok }
    end
  end
  
  #Adjust JSON communication
  #Sproutcore uses the field guid for objects ids, but Rails calls this field id.
  #You have two options on how to convert between these naming conventions:
  #Option 1: Adjust Rails JSON output
  #To customize the JSON output of an object, write a json_to_task protected method in TasksController (app/controllers/tasks_controller.rb): 
  protected
  def json_for_task(task)
    { :guid => task_path(task),
      :description => task.description,
      :isDone => task.isDone
    }
  end
  
end
