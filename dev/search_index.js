var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "A Julia Package for Inter-Process Communication",
    "title": "A Julia Package for Inter-Process Communication",
    "category": "page",
    "text": ""
},

{
    "location": "#A-Julia-Package-for-Inter-Process-Communication-1",
    "page": "A Julia Package for Inter-Process Communication",
    "title": "A Julia Package for Inter-Process Communication",
    "category": "section",
    "text": "Julia has already many methods for inter-process communication (IPC): sockets, semaphores, memory mapped files, etc.  You may however want to have Julia interacts with other processes or threads by means of BSD (System V) IPC or POSIX shared memory, semaphores, message queues or mutexes and condition variables.  Package IPC.jl intends to provide such facilities.The code source of IPC.jl is here.Pages = [\"semaphores.md\", \"reference.md\"]"
},

{
    "location": "#Index-1",
    "page": "A Julia Package for Inter-Process Communication",
    "title": "Index",
    "category": "section",
    "text": ""
},

{
    "location": "semaphores/#",
    "page": "Semaphores",
    "title": "Semaphores",
    "category": "page",
    "text": ""
},

{
    "location": "semaphores/#Semaphores-1",
    "page": "Semaphores",
    "title": "Semaphores",
    "category": "section",
    "text": "A semaphore is associated with an integer value which is never allowed to fall below zero.  Two operations can be performed on a semaphore sem: increment the semaphore value by one with post(sem); and decrement the semaphore value by one with wait(sem).  If the value of a semaphore is currently zero, then a wait(sem) call will block until the value becomes greater than zero.There are two kinds of semaphores: named and anonymous semaphores.  Named Semaphores are identified by their name which is a string of the form \"/somename\".  Anonymous Semaphores are backed by memory objects (usually shared memory) providing the necessary storage.  In Julia IPC package, semaphores are instances of Semaphore{T} where T is String for named semaphores and the type of the backing memory object for anonymous semaphores."
},

{
    "location": "semaphores/#Named-Semaphores-1",
    "page": "Semaphores",
    "title": "Named Semaphores",
    "category": "section",
    "text": "Named semaphores are identified by their name which is a string of the form \"/somename\".  A new named semaphore identified by the string name is created by:Semaphore(name, value; perms=0o600, volatile=true) -> semwhich creates a new named semaphore with initial value set to value and returns an instance of Semaphore{String}.  Keyword perms can be used to specify access permissions (the default value warrants read and write permissions for the caller).  Keyword volatile specify whether the semaphore should be unlinked when the returned object is finalized.Another process (or thread) can open an existing named semaphore by calling:Semaphore(name) -> semwhich yields an instance of Semaphore{String}.To unlink (remove) a persistent named semaphore, simply do:rm(Semaphore, name)If the semaphore does not exists, the error is ignored.  A SystemError is however thrown for other errors.For maximum flexibility, an instance of a named semaphore may also be created by:open(Semaphore, name, flags, mode, value, volatile) -> semwhere flags may have the bits IPC.O_CREAT and IPC.O_EXCL set, mode specifies the granted access permissions, value is the initial semaphore value and volatile is a boolean indicating whether the semaphore should be unlinked when the returned object sem is finalized.  The values of mode and value are ignored if an existing named semaphore is open."
},

{
    "location": "semaphores/#Anonymous-Semaphores-1",
    "page": "Semaphores",
    "title": "Anonymous Semaphores",
    "category": "section",
    "text": "Anonymous semaphores are backed by memory objects providing the necessary storage.A new anonymous semaphore is created by:Semaphore(mem, value; offset=0, volatile=true) -> semwhich initializes an anonymous semaphore backed by memory object mem with initial value set to value and returns an instance of Semaphore{typeof(mem)}.  Keyword offset can be used to specify the address (in bytes) of the semaphore data relative to pointer(mem).  Keyword volatile specify whether the semaphore should be destroyed when the returned object is finalized.The number of bytes needed to store an anonymous semaphore is given by sizeof(Semaphore) and anonymous semaphore must be aligned in memory at multiples of the word size in bytes (that is Sys.WORD_SIZE >> 3).  Memory objects used to store an anonymous semaphore must implement two methods: pointer(mem) and sizeof(mem) to yield respectively the base address (as an instance of Ptr) and the size (in bytes) of the associated memory.Another process (or thread) can use an existing (initialized) anonymous semaphore by calling:Semaphore(mem; offset=0) -> semwhere mem is the memory object which provides the storage of the semaphore at relative position specified by keyword offset (zero by default).  The returned value is an instance of Semaphore{typeof(mem)}"
},

{
    "location": "semaphores/#Operations-on-Semaphores-1",
    "page": "Semaphores",
    "title": "Operations on Semaphores",
    "category": "section",
    "text": ""
},

{
    "location": "semaphores/#Semaphore-Value-and-Size-1",
    "page": "Semaphores",
    "title": "Semaphore Value and Size",
    "category": "section",
    "text": "To query the value of semaphore sem, do:sem[]However beware that the value of the semaphore may already have changed by the time the result is returned.  The minimal and maximal values that can take a semaphore are given by:typemin(Semaphore)\ntypemax(Semaphore)To allocate memory for anonymous semaphores, you need to know the number of bytes needed to store a semaphore.  This is given by:sizeof(Semaphore)"
},

{
    "location": "semaphores/#Post-and-Wait-1",
    "page": "Semaphores",
    "title": "Post and Wait",
    "category": "section",
    "text": "To unlock the semaphore sem, call:post(sem)which increments by one the semaphore\'s value.  If the semaphore\'s value consequently becomes greater than zero, then another process or thread blocked in a wait call on this semaphore will be woken up.Locking the semaphore sem is done by:wait(sem)which decrements by one the semaphore sem.  If the semaphore\'s value is greater than zero, then the decrement proceeds and the function returns immediately.  If the semaphore currently has the value zero, then the call blocks until either it becomes possible to perform the decrement (i.e., the semaphore value rises above zero), or a signal handler interrupts the call (in which case an instance of InterruptException is thrown).  A SystemError may be thrown if an unexpected error occurs.To try locking the semaphore sem without blocking, do:trywait(sem) -> booleanwhich attempts to immediately decrement (lock) the semaphore returning true if successful.  If the decrement cannot be immediately performed, then false is returned.  If an interruption is received or if an unexpected error occurs, an exception is thrown (InterruptException or SystemError repectively).Finally, the call:timedwait(sem, secs)decrements (locks) the semaphore sem.  If the semaphore\'s value is greater than zero, then the decrement proceeds and the function returns immediately. If the semaphore currently has the value zero, then the call blocks until either it becomes possible to perform the decrement (i.e., the semaphore value rises above zero), or the limit of secs seconds expires (in which case an instance of TimeoutError is thrown), or a signal handler interrupts the call (in which case an instance of InterruptException is thrown)."
},

{
    "location": "reference/#",
    "page": "Reference",
    "title": "Reference",
    "category": "page",
    "text": ""
},

{
    "location": "reference/#Reference-1",
    "page": "Reference",
    "title": "Reference",
    "category": "section",
    "text": "The following provides detailled documentation about types and methods provided by the IPC package.  This information is also available from the REPL by typing ? followed by the name of a method or a type."
},

{
    "location": "reference/#IPC.Semaphore",
    "page": "Reference",
    "title": "IPC.Semaphore",
    "category": "type",
    "text": "Named Semaphores\n\nSemaphore(name, value; perms=0o600, volatile=true) -> sem\n\ncreates a new named semaphore identified by the string name of the form \"/somename\" and initial value set to value.  An instance of Semaphore{String} is returned.  Keyword perms can be used to specify access permissions.  Keyword volatile specify whether the semaphore should be unlinked when the returned object is finalized.\n\nSemaphore(name) -> sem\n\nopens an existing named semaphore and returns an instance of Semaphore{String}.\n\nTo unlink (remove) a persistent named semaphore, simply do:\n\nrm(Semaphore, name)\n\nIf the semaphore does not exists, the error is ignored.  A SystemError is however thrown for other errors.\n\nFor maximum flexibility, an instance of a named semaphore may also be created by:\n\nopen(Semaphore, name, flags, mode, value, volatile) -> sem\n\nwhere flags may have the bits IPC.O_CREAT and IPC.O_EXCL set, mode specifies the granted access permissions, value is the initial semaphore value and volatile is a boolean indicating whether the semaphore should be unlinked when the returned object sem is finalized.  The values of mode and value are ignored if an existing named semaphore is open.\n\nAnonymous Semaphores\n\nAnonymous semaphores are backed by memory objects providing the necessary storage.\n\nSemaphore(mem, value; offset=0, volatile=true) -> sem\n\ninitializes an anonymous semaphore backed by memory object mem with initial value set to value and returns an instance of Semaphore{typeof(mem)}. Keyword offset can be used to specify the address (in bytes) of the semaphore data relative to pointer(mem).  Keyword volatile specify whether the semaphore should be destroyed when the returned object is finalized.\n\nSemaphore(mem; offset=0) -> sem\n\nyields an an instance of Semaphore{typeof(mem)} associated with an initialized anonymous semaphore and backed by memory object mem at relative position (in bytes) specified by keyword offset.\n\nThe number of bytes needed to store an anonymous semaphore is given by sizeof(Semaphore) and anonymous semaphore must be aligned in memory at multiples of the word size (that is Sys.WORD_SIZE >> 3 in bytes).  Memory objects used to store an anonymous semaphore must implement two methods: pointer(mem) and sizeof(mem) to yield respectively the base address and the size (in bytes) of the associated memory.\n\nSee also: post, wait, timedwait,           trywait.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.post-Tuple{Semaphore}",
    "page": "Reference",
    "title": "IPC.post",
    "category": "method",
    "text": "post(sem)\n\nincrements (unlocks) the semaphore sem.  If the semaphore\'s value consequently becomes greater than zero, then another process or thread blocked in a wait call on this semaphore will be woken up.\n\nSee also: Semaphore, wait, timedwait,           trywait.\n\n\n\n\n\n"
},

{
    "location": "reference/#Base.wait-Tuple{Semaphore}",
    "page": "Reference",
    "title": "Base.wait",
    "category": "method",
    "text": "wait(sem)\n\ndecrements (locks) the semaphore sem.  If the semaphore\'s value is greater than zero, then the decrement proceeds and the function returns immediately. If the semaphore currently has the value zero, then the call blocks until either it becomes possible to perform the decrement (i.e., the semaphore value rises above zero), or a signal handler interrupts the call (in which case an instance of InterruptException is thrown).  A SystemError may be thrown if an unexpected error occurs.\n\nSee also: Semaphore, post, timedwait,           trywait.\n\n\n\n\n\n"
},

{
    "location": "reference/#Base.timedwait-Tuple{Semaphore,Real}",
    "page": "Reference",
    "title": "Base.timedwait",
    "category": "method",
    "text": "timedwait(sem, secs)\n\ndecrements (locks) the semaphore sem.  If the semaphore\'s value is greater than zero, then the decrement proceeds and the function returns immediately. If the semaphore currently has the value zero, then the call blocks until either it becomes possible to perform the decrement (i.e., the semaphore value rises above zero), or the limit of secs seconds expires (in which case an instance of TimeoutError is thrown), or a signal handler interrupts the call (in which case an instance of InterruptException is thrown).\n\nSee also: Semaphore, post, wait,           trywait.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.trywait-Tuple{Semaphore}",
    "page": "Reference",
    "title": "IPC.trywait",
    "category": "method",
    "text": "trywait(sem) -> boolean\n\nattempts to immediately decrement (lock) the semaphore sem returning true if successful.  If the decrement cannot be immediately performed, then the call returns false.  If an interruption is received or if an unexpected error occurs, an exception is thrown (InterruptException or SystemError repectively).\n\nSee also: Semaphore, post, wait,           timedwait.\n\n\n\n\n\n"
},

{
    "location": "reference/#Semaphores-1",
    "page": "Reference",
    "title": "Semaphores",
    "category": "section",
    "text": "Semaphorepost(::Semaphore)wait(::Semaphore)timedwait(::Semaphore, ::Real)trywait(::Semaphore)"
},

{
    "location": "reference/#IPC.TimeoutError",
    "page": "Reference",
    "title": "IPC.TimeoutError",
    "category": "type",
    "text": "TimeoutError is used to throw a timeout exception.\n\n\n\n\n\n"
},

{
    "location": "reference/#Exceptions-1",
    "page": "Reference",
    "title": "Exceptions",
    "category": "section",
    "text": "TimeoutError"
},

]}
