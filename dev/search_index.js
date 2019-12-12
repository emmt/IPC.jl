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
    "text": "Julia has already many methods for inter-process communication (IPC): sockets, semaphores, memory mapped files, etc.  You may however want to have Julia interacts with other processes or threads by means of BSD (System V) IPC or POSIX shared memory, semaphores, message queues or mutexes and condition variables.  Package IPC.jl intends to provide such facilities.The code source of IPC.jl is here.Pages = [\"semaphores.md\", \"sharedmemory.md\", \"reference.md\"]"
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
    "location": "sharedmemory/#",
    "page": "Shared Memory",
    "title": "Shared Memory",
    "category": "page",
    "text": ""
},

{
    "location": "sharedmemory/#Shared-Memory-1",
    "page": "Shared Memory",
    "title": "Shared Memory",
    "category": "section",
    "text": "The IPC package provides two kinds of shared memory objects: named shared memory objects which are identified by their name and BSD (System V) shared memory segments which are identified by a key."
},

{
    "location": "sharedmemory/#Shared-Memory-Objects-1",
    "page": "Shared Memory",
    "title": "Shared Memory Objects",
    "category": "section",
    "text": "Shared memory objects are instances of IPC.SharedMemory.  A new shared memory object is created by calling:SharedMemory(id, len; perms=0o600, volatile=true)with id an identifier and len the size, in bytes, of the allocated memory. The identifier id can be a string starting by a \'/\' to create a POSIX shared memory object or a System V IPC key to create a BSD System V shared memory segment.  In this latter case, the key can be IPC.PRIVATE to automatically create a non-existing shared memory segment.Use keyword perms to specify which access permissions are granted.  By default, only reading and writing by the user is granted.Use keyword volatile to specify whether the shared memory is volatile or not. If non-volatile, the shared memory will remain accessible until explicit destruction or system reboot.  By default, the shared memory is destroyed when no longer in use.To retrieve an existing shared memory object, call:SharedMemory(id; readonly=false)where id is the shared memory identifier (a string, an IPC key or a System V IPC identifier of shared memory segment as returned by ShmId).  Keyword readonly can be set true if only read access is needed.  Note that method shmid(obj) may be called to retrieve the identifier of the shared memory object obj.Some methods are extended for shared memory objects.  Assuming shm is an instance of SharedMemory, then:pointer(shm)    # yields the base address of the shared memory\nsizeof(shm)     # yields the number of bytes of the shared memory\nshmid(shm)      # yields the identifier the shared memoryTo ensure that shared memory object shm is eventually destroyed, call:rm(shm)"
},

{
    "location": "sharedmemory/#BSD-System-V-Shared-Memory-1",
    "page": "Shared Memory",
    "title": "BSD System V Shared Memory",
    "category": "section",
    "text": "The following methods and type give a lower-level access (compared to SharedMemory objects) to manage BSD System V shared memory segments."
},

{
    "location": "sharedmemory/#System-V-shared-memory-segment-identifiers-1",
    "page": "Shared Memory",
    "title": "System V shared memory segment identifiers",
    "category": "section",
    "text": "The following statements:ShmId(id)                  -> id\nShmId(arr)                 -> id\nShmId(key, readlony=false) -> idyield the the identifier of the existing System V shared memory segment associated with the value of the first argument.  id is the identifier of the shared memory segment, arr is an array attached to a System V shared memory segment and key is the key associated with the shared memory segment.  In that latter case, readlony can be set true to only request read-only access; otherwise read-write access is requested."
},

{
    "location": "sharedmemory/#Getting-or-creating-a-shared-memory-segment-1",
    "page": "Shared Memory",
    "title": "Getting or creating a shared memory segment",
    "category": "section",
    "text": "Call:shmget(key, siz, flg) -> idto get the identifier of the shared memory segment associated with the System V IPC key key.  A new shared memory segment, with size equal to the value of siz (possibly rounded up to a multiple of the memory page size IPC.PAGE_SIZE), is created if key has the value IPC.PRIVATE or if IPC_CREAT is specified in the argument flg, key isn\'t IPC.PRIVATE and no shared memory segment corresponding to key exists.Argument flg is a bitwise combination of flags.  The least significant 9 bits specify the permissions granted to the owner, group, and others.  These bits have the same format, and the same meaning, as the mode argument of chmod. Bit IPC_CREAT can be set to create a new segment.  If this flag is not used, then shmget will find the segment associated with key and check to see if the user has permission to access the segment.  Bit IPC_EXCL can be set in addition to IPC_CREAT to ensure that this call creates the segment.  If IPC_EXCL and IPC_CREAT are both set, the call will fail if the segment already exists."
},

{
    "location": "sharedmemory/#Attaching-and-detaching-shared-memory-1",
    "page": "Shared Memory",
    "title": "Attaching and detaching shared memory",
    "category": "section",
    "text": "Call:shmat(id, readonly) -> ptrto attach an existing shared memory segment to the address space of the caller. Argument id is the identifier of the shared memory segment.  Boolean argument readonly specifies whether to attach the segment for read-only access; otherwise, the segment is attached for read and write accesses and the process must have read and write permissions for the segment.  The returned value is a pointer to the shared memory segment in the caller address space.Assuming ptr is the pointer returned by a previous shmat() call:shmdt(ptr)detaches the System V shared memory segment from the address space of the caller."
},

{
    "location": "sharedmemory/#Destroying-shared-memory-1",
    "page": "Shared Memory",
    "title": "Destroying shared memory",
    "category": "section",
    "text": "To remove shared memory assoicaite with arg, call:shmrm(arg)If arg is a name, the corresponding POSIX named shared memory is unlinked. If arg is a key or identifier of a BSD shared memory segment, the segment is marked to be eventually destroyed.  Argument arg can also be a SharedMemory object.The rm method may also be called to remove an existing shared memory segment or object:rm(SharedMemory, name)\nrm(SharedMemory, key)\nrm(id)\nrm(shm)where name identifies a POSIX shared memory object, key is associated with a BSD shared memory segment, id is the identifier of a BSD shared memory segment and shm is an instance of SharedMemory."
},

{
    "location": "sharedmemory/#Controlling-shared-memory-1",
    "page": "Shared Memory",
    "title": "Controlling shared memory",
    "category": "section",
    "text": "To change the access permissions of a System V IPC shared memory segment, call:shmcfg(arg, perms) -> idwhere perms specifies bitwise flags with the new permissions.  The first argument can be the identifier of the shared memory segment, a shared array attached to the shared memory segment or the System V IPC key associated with the shared memory segment.  In all cases, the identifier of the shared memory segment is returned.Other control operations can be performed with:shmctl(id, cmd, buf)where id is the identifier of the shared memory segment, cmd is the command to perform and buf is a buffer large enough to store a shmid_ds C structure (IPC._sizeof_struct_shmid_ds bytes)."
},

{
    "location": "sharedmemory/#Retrieving-shared-memory-information-1",
    "page": "Shared Memory",
    "title": "Retrieving shared memory information",
    "category": "section",
    "text": "To retrieve information about a System V shared memory segment, call one of:shminfo(arg) -> info\nShmInfo(arg) -> infowith arg the identifier of the shared memory segment, a shared array attached to the shared memory segment or the System V IPC key associated with the shared memory segment.  The result is an instance of  ShmInfo.Memory for the ShmInfo structure may be provided:shminfo!(arg, info) -> infowhere info is an instance of ShmInfo which is overwritten with information about arg and returned."
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
    "text": "Semaphore\npost(::Semaphore)\nwait(::Semaphore)\ntimedwait(::Semaphore, ::Real)\ntrywait(::Semaphore)"
},

{
    "location": "reference/#IPC.SharedMemory",
    "page": "Reference",
    "title": "IPC.SharedMemory",
    "category": "type",
    "text": "SharedMemory(id, len; perms=0o600, volatile=true)\n\nyields a new shared memory object identified by id and whose size is len bytes.  The identifier id can be a string starting by a \'/\' to create a POSIX shared memory object or a System V IPC key to create a System V shared memory segment.  In this latter case, the key can be IPC.PRIVATE to automatically create a non-existing shared memory segment.\n\nKeyword perms can be used to specify which access permissions are granted. By default, only reading and writing by the user is granted.\n\nKeyword volatile can be used to specify whether the shared memory is volatile or not.  If non-volatile, the shared memory will remain accessible until explicit destruction or system reboot.  By default, the shared memory is destroyed when no longer in use.\n\nTo retrieve an existing shared memory object, call:\n\nSharedMemory(id; readonly=false)\n\nwhere id is the shared memory identifier (a string, an IPC key or a System V IPC identifier of shared memory segment as returned by ShmId).  Keyword readonly can be set true if only read access is needed.  Note that method shmid(obj) may be called to retrieve the identifier of the shared memory object obj.\n\nSome methods are extended for shared memory objects.  Assuming shm is an instance of SharedMemory, then:\n\npointer(shm)    # yields the base address of the shared memory\nsizeof(shm)     # yields the number of bytes of the shared memory\nshmid(shm)      # yields the identifier the shared memory\n\nTo ensure that shared memory object shm is eventually destroyed, call:\n\nrm(shm)\n\nSee also shmid, shmrm.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.ShmId",
    "page": "Reference",
    "title": "IPC.ShmId",
    "category": "type",
    "text": "Get the identifier of an existing System V shared memory segment\n\nThe following calls:\n\nShmId(id)                  -> id\nShmId(arr)                 -> id\nShmId(key, readlony=false) -> id\n\nyield the the identifier of the existing System V shared memory segment associated with the value of the first argument.  id is the identifier of the shared memory segment, arr is an array attached to a System V shared memory segment and key is the key associated with the shared memory segment.  In that latter case, readlony can be set true to only request read-only access; otherwise read-write access is requested.\n\nSee also: shmid, shmget.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.ShmInfo",
    "page": "Reference",
    "title": "IPC.ShmInfo",
    "category": "type",
    "text": "ShmInfo is the structure used to store information about a System V shared memory segment. The call ShmInfo(arg) is equivalent to shminfo(arg).\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.shmid",
    "page": "Reference",
    "title": "IPC.shmid",
    "category": "function",
    "text": "shmid(arg)\n\nyield the identifier of an existing POSIX shared memory object or Sytem V shared memory segment identifed by arg or associated with arg.  Argument can be:\n\nAn instance of SharedMemory.\nAn instance of WrappedArray whose contents is stored into shared memory.\nA string starting with a \'/\' (and no other \'/\') to identify a POSIX shared memory object.\nAn instance of IPC.Key to specify a System V IPC key associated with a shared memory segment.  In that case, an optional second argument readonly can be set true to only request read-only access; otherwise read-write access is requested.\nAn instance of ShmId to specify a System V shared memory segment.\n\nSee also: SharedMemory, shmrm.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.shmget",
    "page": "Reference",
    "title": "IPC.shmget",
    "category": "function",
    "text": "Get or create a System V shared memory segment\n\nThe call:\n\nshmget(key, siz, flg) -> id\n\nyields the identifier of the shared memory segment associated with the value of the argument key.  A new shared memory segment, with size equal to the value of siz (possibly rounded up to a multiple of the memory page size IPC.PAGE_SIZE), is created if key has the value IPC.PRIVATE or key isn\'t IPC.PRIVATE, no shared memory segment corresponding to key exists, and IPC_CREAT is specified in argument flg.\n\nArguments are:\n\nkey is the System V IPC key associated with the shared memory segment.\nsiz specifies the size (in bytes) of the shared memory segment (may be rounded up to multiple of the memory page size).\nflg is a bitwise combination of flags.  The least significant 9 bits specify the permissions granted to the owner, group, and others.  These bits have the same format, and the same meaning, as the mode argument of chmod. Bit IPC_CREAT can be set to create a new segment.  If this flag is not used, then shmget will find the segment associated with key and check to see if the user has permission to access the segment.  Bit IPC_EXCL can be set in addition to IPC_CREAT to ensure that this call creates the segment. If IPC_EXCL and IPC_CREAT are both set, the call will fail if the segment already exists.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.shmat",
    "page": "Reference",
    "title": "IPC.shmat",
    "category": "function",
    "text": "shmat(id, readonly) -> ptr\n\nattaches a shared memory segment to the address space of the caller.  Argument id is the identifier of the shared memory segment.  Boolean argument readonly specifies whether to attach the segment for read-only access; otherwise, the segment is attached for read and write accesses and the process must have read and write permissions for the segment.  The returned value is the pointer to access the shared memory segment.\n\nSee also: shmdt, shmrm.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.shmdt",
    "page": "Reference",
    "title": "IPC.shmdt",
    "category": "function",
    "text": "shmdt(ptr)\n\ndetaches a System V shared memory segment from the address space of the caller. Argument ptr is the pointer returned by a previous shmat() call.\n\nSee also: shmdt, shmget.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.shmrm",
    "page": "Reference",
    "title": "IPC.shmrm",
    "category": "function",
    "text": "shmrm(arg)\n\nremoves the shared memory associated with arg.  If arg is a name, the corresponding POSIX named shared memory is unlinked.  If arg is a key or identifier of a BSD shared memory segment, the segment is marked to be eventually destroyed.  Argument arg can also be a SharedMemory object.\n\nThe rm method may also be called to remove an existing shared memory segment or object.  There are several possibilities:\n\nrm(SharedMemory, name)  # `name` identifies a POSIX shared memory object\nrm(SharedMemory, key)   # `key` is associated with a BSD shared memory segment\nrm(id)                  # `id` is the identifier of a BSD shared memory segment\nrm(shm)                 # `shm` is an instance of `SharedMemory`\n\nSee also: SharedMemory, shmid, shmat.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.shmctl",
    "page": "Reference",
    "title": "IPC.shmctl",
    "category": "function",
    "text": "shmctl(id, cmd, buf)\n\nperforms the control operation specified by cmd on the System V shared memory segment whose identifier is given in id.  The buf argument is a pointer to a shmid_ds C structure.\n\nSee also shminfo, shmcfg and shmrm.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.shmcfg",
    "page": "Reference",
    "title": "IPC.shmcfg",
    "category": "function",
    "text": "shmcfg(arg, perms) -> id\n\nchanges the access permissions of a System V IPC shared memory segment. Argument perms specifies bitwise flags with the new permissions.  The first argument arg can be the identifier of the shared memory segment, a shared array attached to the shared memory segment or the System V IPC key associated with the shared memory segment.  In all cases, the identifier of the shared memory segment is returned.\n\nSee also ShmId, shmget, shmctl and SharedMemory.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.shminfo",
    "page": "Reference",
    "title": "IPC.shminfo",
    "category": "function",
    "text": "shminfo(arg) -> info\n\nyields information about the System V shared memory segment identified or associated with arg which can be the identifier of the shared memory segment, a shared array attached to the shared memory segment or the System V IPC key associated with the shared memory segment.\n\nSee also ShmInfo, ShmId, shmget, shmat, SharedMemory.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.shminfo!",
    "page": "Reference",
    "title": "IPC.shminfo!",
    "category": "function",
    "text": "shminfo!(arg, info) -> info\n\noverwrites info (an instance of ShmInfo) with the information about the System V shared memory segment identified or associated with arg.  See shminfo for more details.\n\n\n\n\n\n"
},

{
    "location": "reference/#Shared-Memory-1",
    "page": "Reference",
    "title": "Shared Memory",
    "category": "section",
    "text": "SharedMemory\nShmId\nShmInfo\nshmid\nshmget\nshmat\nshmdt\nshmrm\nshmctl\nshmcfg\nshminfo\nshminfo!"
},

{
    "location": "reference/#IPC.SigSet",
    "page": "Reference",
    "title": "IPC.SigSet",
    "category": "type",
    "text": "SigSet represents a C sigset_t structure.  It should be considered as opaque, its contents is stored as a tuple of unsigned integers whose size matches that of sigset_t.\n\nTypical usage is:\n\nsigset = SigSet()\nsigset[signum] -> boolean\nsigset[signum] = boolean\nfill!(sigset, boolean) -> sigset\n\nwhere signum is the signal number, an integer greater or equal 1 and less or equalIPC.SIGRTMAX.  Real-time signals have a number signum such that IPC.SIGRTMIN ≤ signum ≤ IPC.SIGRTMAX\n\nNon-exported methods:\n\nIPC.sigfillset!(sigset)          # same as fill!(signum, true)\nIPC.sigemptyset!(sigset)         # same as fill!(signum, false)\nIPC.sigaddset!(sigset, signum)   # same as sigset[signum] = true\nIPC.sigdelset!(sigset, signum)   # same as sigset[signum] = false\nIPC.sigismember(sigset, signum)  # same as sigset[signum]\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.SigAction",
    "page": "Reference",
    "title": "IPC.SigAction",
    "category": "type",
    "text": "SigAction is the counterpart of the C struct sigaction structure.  It is used to specify the action taken by a process on receipt of a signal.  Assuming sa is an instance of SigAction, its fields are:\n\nsa.handler         # address of a signal handler\nsa.mask            # mask of the signals to block\nsa.flags           # bitwise flags\n\nwhere sa.handler is the address of a C function (can be SIG_IGN or SIG_DFL) to be called on receipt of the signal.  This function may be given by cfunction.  If IPC.SA_INFO is not set in sa.flags, then the signature of the handler is:\n\nfunction handler(signum::Cint)::Nothing\n\nthat is a function which takes a single argument of type Cint and returns nothing; if IPC.SA_INFO is not set in sa.flags, then the signature of the handler is:\n\nfunction handler(signum::Cint, siginf::Ptr{SigInfo}, unused::Ptr{Cvoid})::Nothing\n\nthat is a function which takes 3 arguments of type Cint, Ptr{SigInfo}, Ptr{Cvoid} repectively and which returns nothing.  See SigInfo for a description of the siginf argument by the handler.\n\nCall:\n\nsa = SigAction()\n\nto create a new empty structure or\n\nsa = SigAction(handler, mask, flags)\n\nto provide all fields.\n\nSee also SigInfo, sigaction and sigaction!.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.SigInfo",
    "page": "Reference",
    "title": "IPC.SigInfo",
    "category": "type",
    "text": "SigInfo represents a C siginfo_t structure.  It should be considered as opaque, its contents is stored as a tuple of unsigned integers whose size matches that of siginfo_t but, in principle, only a pointer of it should be received by a signal handler established with the SA_SIGINFO flag.\n\nGiven ptr, an instance of Ptr{SigInfo} received by a signal handler, the members of the corresponding C siginfo_t structure are retrieved by:\n\nIPC.siginfo_signo(ptr)  # Signal number.\nIPC.siginfo_code(ptr)   # Signal code.\nIPC.siginfo_errno(ptr)  # If non-zero, an errno value associated with this\n                        # signal.\nIPC.siginfo_pid(ptr)    # Sending process ID.\nIPC.siginfo_uid(ptr)    # Real user ID of sending process.\nIPC.siginfo_addr(ptr)   # Address of faulting instruction.\nIPC.siginfo_status(ptr) # Exit value or signal.\nIPC.siginfo_band(ptr)   # Band event for SIGPOLL.\nIPC.siginfo_value(ptr)  # Signal value.\n\nThese methods are unsafe because they directly use an address.  They are therefore not exported by default.  Depending on the context, not all members of siginfo_t are relevant (furthermore they may be defined as union and thus overlap in memory).  For now, only the members defined by the POSIX standard are accessible.  Finally, the value given by IPC.siginfo_value(ptr) represents a C type union sigval (an union of a C int and a C void*), in Julia it is returned (and set in sigqueue) as an integer large enough to represent both kind of values.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigaction",
    "page": "Reference",
    "title": "IPC.sigaction",
    "category": "function",
    "text": "sigaction(signum) -> sigact\n\nyields the current action (an instance of SigAction) taken by the process on receipt of the signal signum.\n\nsigaction(signum, sigact)\n\ninstalls sigact (an instance of SigAction) to be the action taken by the process on receipt of the signal signum.\n\nNote that signum cannot be SIGKILL nor SIGSTOP.\n\nSee also SigAction and sigaction!.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigaction!",
    "page": "Reference",
    "title": "IPC.sigaction!",
    "category": "function",
    "text": "sigaction!(signum, sigact, oldact) -> oldact\n\ninstalls sigact to be the action taken by the process on receipt of the signal signum, overwrites oldact with the previous action and returns it. Arguments sigact and oldact are instances of SigAction.\n\nSee SigAction and sigaction for more details.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigpending",
    "page": "Reference",
    "title": "IPC.sigpending",
    "category": "function",
    "text": "sigpending() -> mask\n\nyields the set of signals that are pending for delivery to the calling thread (i.e., the signals which have been raised while blocked).  The returned value is an instance of SigSet.\n\nSee also: sigpending!.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigpending!",
    "page": "Reference",
    "title": "IPC.sigpending!",
    "category": "function",
    "text": "sigpending!(mask) -> mask\n\noverwites mask with the set of pending signals and returns its argument.\n\nSee also: sigpending.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigprocmask",
    "page": "Reference",
    "title": "IPC.sigprocmask",
    "category": "function",
    "text": "sigprocmask() -> cur\n\nyields the current set of blocked signals.  To change the set of blocked signals, call:\n\nsigprocmask(how, set)\n\nwith set a SigSet mask and how a parameter which specifies how to interpret set:\n\nIPC.SIG_BLOCK: The set of blocked signals is the union of the current set and the set argument.\nIPC.SIG_UNBLOCK: The signals in set are removed from the current set of blocked signals.  It is permissible to attempt to unblock a signal which is not blocked.\nIPC.SIG_SETMASK: The set of blocked signals is set to the argument set.\n\nSee also: sigprocmask!.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigprocmask!",
    "page": "Reference",
    "title": "IPC.sigprocmask!",
    "category": "function",
    "text": "sigprocmask!(cur) -> cur\n\noverwrites cur, an instance of SigSet, with the current set of blocked signals and returns it.  To change the set of blocked signals, call:\n\nsigprocmask!(how, set, old) -> old\n\nwhich changes the set of blocked signals according to how and set (see sigprocmask), overwrites old, an instance of SigSet, with the previous set of blocked signals and returns old.\n\nSee also: sigprocmask.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigqueue",
    "page": "Reference",
    "title": "IPC.sigqueue",
    "category": "function",
    "text": "sigqueue(pid, sig, val=0)\n\nsends the signal sig to the process whose identifier is pid.  Argument val is an optional value to join to to the signal.  This value represents a C type union sigval (an union of a C int and a C void*), in Julia it is specified as an integer large enough to represent both kind of values.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigsuspend",
    "page": "Reference",
    "title": "IPC.sigsuspend",
    "category": "function",
    "text": "sigsuspend(mask)\n\ntemporarily replaces the signal mask of the calling process with the mask given by mask and then suspends the process until delivery of a signal whose action is to invoke a signal handler or to terminate a process.\n\nIf the signal terminates the process, then sigsuspend does not return.  If the signal is caught, then sigsuspend returns after the signal handler returns, and the signal mask is restored to the state before the call to sigsuspend.\n\nIt is not possible to block IPC.SIGKILL or IPC.SIGSTOP; specifying these signals in mask, has no effect on the process\'s signal mask.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigwait",
    "page": "Reference",
    "title": "IPC.sigwait",
    "category": "function",
    "text": "sigwait(mask, timeout=Inf) -> signum\n\nsuspends execution of the calling thread until one of the signals specified in the signal set mask becomes pending.  The function accepts the signal (removes it from the pending list of signals), and returns the signal number signum.\n\nOptional argument timeout can be specified to set a limit on the time to wait for one the signals to become pending.  timeout can be a real number to specify a number of seconds or an instance of TimeSpec.  If timeout is Inf (the default), it is assumed that there is no limit on the time to wait.  If timeout is a number of seconds smaller or equal zero or if timeout is TimeSpec(0,0), the methods performs a poll and returns immediately.  It none of the signals specified in the signal set mask becomes pending during the allowed waiting time, a TimeoutError exception is thrown.\n\nSee also: sigwait!, TimeSpec, TimeoutError.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.sigwait!",
    "page": "Reference",
    "title": "IPC.sigwait!",
    "category": "function",
    "text": "sigwait!(mask, info, timeout=Inf) -> signum\n\nbehaves like sigwait but additional argument info is an instance of SigInfo to store the information about the accepted signal, other arguments are as for the sigwait method.\n\n\n\n\n\n"
},

{
    "location": "reference/#Signals-1",
    "page": "Reference",
    "title": "Signals",
    "category": "section",
    "text": "SigSet\nSigAction\nSigInfo\nsigaction\nsigaction!\nsigpending\nsigpending!\nsigprocmask\nsigprocmask!\nsigqueue\nsigsuspend\nsigwait\nsigwait!"
},

{
    "location": "reference/#IPC.WrappedArray",
    "page": "Reference",
    "title": "IPC.WrappedArray",
    "category": "type",
    "text": "WrappedArray(mem, [T [, dims...]]; offset=0)\n\nyields a Julia array whose elements are stored in the \"memory\" object mem. Argument T is the data type of the elements of the returned array and argument(s) dims specify the dimensions of the array.  If dims is omitted the result is a vector of maximal length (accounting for the offset and the size of the mem object).  If T is omitted, UInt8 is assumed.\n\nKeyword offset may be used to specify the address (in bytes) relative to pointer(mem) where is stored the first element of the array.\n\nThe size of the memory provided by mem must be sufficient to store all elements (accounting for the offset) and the alignment of the elements in memory must be a multiple of Base.datatype_alignment(T).\n\nAnother possibility is:\n\nWrappedArray(mem, dec)\n\nwhere mem is the \"memory\" object and dec is a function in charge of decoding the array type and layout given the memory object.  The decoder is applied to the memory object as follow:\n\ndec(mem) -> T, dims, offset\n\nwhich must yield the data type T of the array elements, the dimensions dims of the array and the offset of the first element relative to pointer(mem).\n\nRestrictions\n\nThe mem object must extend the methods pointer(mem) and sizeof(mem) which must respectively yield the base address of the memory provided by mem and the number of available bytes.  Furthermore, this memory is assumed to be available at least until object mem is reclaimed by the garbage collector.\n\nShared Memory Arrays\n\nWrappedArray(id, T, dims; perms=0o600, volatile=true)\n\ncreates a new wrapped array whose elements (and a header) are stored in shared memory identified by id (see SharedMemory for a description of id and for keywords).  To retrieve this array in another process, just do:\n\nWrappedArray(id; readonly=false)\n\nSee Also\n\nSharedMemory.\n\n\n\n\n\n"
},

{
    "location": "reference/#Wrapped-arrays-1",
    "page": "Reference",
    "title": "Wrapped arrays",
    "category": "section",
    "text": "WrappedArray"
},

{
    "location": "reference/#IPC.TimeSpec",
    "page": "Reference",
    "title": "IPC.TimeSpec",
    "category": "type",
    "text": "TimeSpec(sec, nsec)\n\nyields an instance of TimeSpec for an integer number of seconds sec and an integer number of nanoseconds nsec since the Epoch.\n\nTimeSpec(sec)\n\nyields an instance of TimeSpec for a, possibly fractional, number of seconds sec since the Epoch.  Argument can also be an instance of TimeVal.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.TimeVal",
    "page": "Reference",
    "title": "IPC.TimeVal",
    "category": "type",
    "text": "TimeVal(sec, usec)\n\nyields an instance of TimeVal for an integer number of seconds sec and an integer number of microseconds usec since the Epoch.\n\nTimeVal(sec)\n\nyields an instance of TimeVal with a, possibly fractional, number of seconds sec since the Epoch.  Argument can also be an instance of TimeSpec.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.clock_getres",
    "page": "Reference",
    "title": "IPC.clock_getres",
    "category": "function",
    "text": "clock_getres(id) -> ts\n\nyields the resolution (precision) of the specified clock id. The result is an instance of IPC.TimeSpec.  Clock identifier id can be CLOCK_REALTIME or CLOCK_MONOTONIC (described in clock_gettime).\n\nSee also clock_gettime, clock_settime, gettimeofday, nanosleep, IPC.TimeSpec and IPC.TimeVal.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.clock_gettime",
    "page": "Reference",
    "title": "IPC.clock_gettime",
    "category": "function",
    "text": "clock_gettime(id) -> ts\n\nyields the time of the specified clock id.  The result is an instance of IPC.TimeSpec.  Clock identifier id can be one of:\n\nCLOCK_REALTIME: System-wide clock that measures real (i.e., wall-clock) time.  This clock is affected by discontinuous jumps in the system time (e.g., if the system administrator manually changes the clock), and by the incremental adjustments performed by adjtime and NTP.\nCLOCK_MONOTONIC: Clock that cannot be set and represents monotonic time since some unspecified starting point.  This clock is not affected by discontinuous jumps in the system time.\n\nSee also clock_getres, clock_settime, gettimeofday, nanosleep, IPC.TimeSpec and IPC.TimeVal.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.clock_settime",
    "page": "Reference",
    "title": "IPC.clock_settime",
    "category": "function",
    "text": "clock_settime(id, ts)\n\nset the time of the specified clock id to ts.  Argument ts can be an instance of IPC.TimeSpec or a number of seconds.  Clock identifier id can be CLOCK_REALTIME or CLOCK_MONOTONIC (described in clock_gettime).\n\nSee also clock_getres, clock_gettime, gettimeofday, nanosleep, IPC.TimeSpec and IPC.TimeVal.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.gettimeofday",
    "page": "Reference",
    "title": "IPC.gettimeofday",
    "category": "function",
    "text": "gettimeofday() -> tv\n\nyields the current time as an instance of IPC.TimeVal.  The result can be converted into a fractional number of seconds by calling float(tv).\n\nSee also: IPC.TimeVal, nanosleep, clock_gettime.\n\n\n\n\n\n"
},

{
    "location": "reference/#IPC.nanosleep",
    "page": "Reference",
    "title": "IPC.nanosleep",
    "category": "function",
    "text": "nanosleep(t) -> rem\n\nsleeps for t seconds with nanosecond precision and returns the remaining time (in case of interrupts) as an instance of IPC.TimeSpec.  Argument can be a (fractional) number of seconds or an instance of IPC.TimeSpec or IPC.TimeVal.\n\nThe sleep method provided by Julia has only millisecond precision.\n\nSee also gettimeofday, IPC.TimeSpec and IPC.TimeVal.\n\n\n\n\n\n"
},

{
    "location": "reference/#Utilities-1",
    "page": "Reference",
    "title": "Utilities",
    "category": "section",
    "text": "TimeSpec\nTimeVal\nclock_getres\nclock_gettime\nclock_settime\ngettimeofday\nnanosleep"
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
