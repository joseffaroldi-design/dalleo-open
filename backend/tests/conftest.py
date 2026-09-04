"""Shared fixtures for the backend test suite."""
import fcntl

import pytest


@pytest.fixture(scope="module")
def scoring_doc_lock():
    """Cross-process mutex held for the duration of a scoring test module.

    pytest-xdist runs modules on separate workers against one preview backend;
    this advisory file lock serializes scoring-doc writes across workers.
    Module scope means one hold per module — no re-acquisition per test.
    """
    handle = open("/tmp/dalleo_scoring_test.lock", "w")
    try:
        fcntl.flock(handle, fcntl.LOCK_EX)
        yield
        fcntl.flock(handle, fcntl.LOCK_UN)
    finally:
        handle.close()
