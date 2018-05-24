# Inter-Process Communication for Julia

[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE.md)
[![Build Status](https://travis-ci.org/emmt/IPC.jl.svg?branch=master)](https://travis-ci.org/emmt/IPC.jl)
[![Coverage Status](https://coveralls.io/repos/emmt/IPC.jl/badge.svg?branch=master&service=github)](https://coveralls.io/github/emmt/IPC.jl?branch=master)
[![codecov.io](http://codecov.io/github/emmt/IPC.jl/coverage.svg?branch=master)](http://codecov.io/github/emmt/IPC.jl?branch=master)

Julia has already many methods for inter-process communication (IPC): sockets,
semaphores, memory mapped files, etc.  You may however want to have Julia
interacts with other processes or threads by means of BSD (System V) IPC or
POSIX shared memory, semaphores, message queues or mutexes and condition
variables.  Module `IPC.jl` intends to provide such facilities.

*For now, only shared memory, mutexes and condition variables are implemented.*

Julia IPC package provides:

* Two kinds of [**shared memory**](doc/sharedmemory.md) objects:
  [named shared memory](doc/sharedmemory.md#posix-shared-memory) which are
  identified by their name and BSD (System V)
  [shared memory segment](doc/sharedmemory.md#bsd-shared-memory) which are
  identified by a key.

* Two kinds of [**semaphores**](doc/semaphores.md):
  [named semaphores](doc/semaphores.md#named-semaphores) which are identified
  by their name and
  [anonymous semaphores](doc/semaphores.md#anonymous-semaphores) which are
  backed by *memory* objects (usually shared memory) providing the necessary
  storage.


## Installation

Installation is not yet fully automated in the spirit of Julia packages.  There
are two possibilities to use the code.


### Clone the code with Julia package manager

You may use Julia package manager to clone the repository and build the files
needed by the module:

    Pkg.clone("https://github.com/emmt/IPC.jl.git")
    Pkg.build("IPC")

Later, it is sufficient to do:

    Pkg.update("IPC")
    Pkg.build("IPC")

to pull the latest version and rebuild the dependencies.


###  Use your own copy of the repository

You can clone this package into some directory by moving to this directory and
typing:

    git clone https://github.com/emmt/IPC.jl.git

(you may use GiHub `Clone` button to get the actual URL).  After cloning,
go to the subdirectory `deps` of the cloned repository and type `make`.

If Julia's package manager is not used, you have to make sure that the
repository of `IPC.jl` is found by Julia. You may modify Julia global variable
`LOAD_PATH` for that (for instance in your custom initialization file
`~/.juliarc.jl`).

If you have `IPC.jl` repository not managed at all by Julia's package manager
(for instance you have cloned this repository as explained above), updating is
a matter of:

    cd "$REPOSITORY/deps"
    git pull
    make

assuming `$REPOSITORY` is the path to the top level directory of the `IPC.jl`
repository.  This should compile a small executable `gencode` and generate the
file `constants.jl` with all constants required by the `IPC` module and which
may depend on your machine.
