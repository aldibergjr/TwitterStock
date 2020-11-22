import os
import logging
from concurrent.futures import ProcessPoolExecutor
import worker

logger = logging.getLogger('server')
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
ch.setFormatter(logging.Formatter(
    '%(asctime)s :: %(name)s :: [%(levelname)s] %(message)s'))
logger.addHandler(ch)


_NUM_WORKERS = int(os.environ.get('NUM_WORKERS', 8))

if __name__ == "__main__":
    logger.info(f'Initializing pool of workers with: {_NUM_WORKERS} workers')
    with ProcessPoolExecutor(_NUM_WORKERS) as executor:
        futures = [executor.submit(worker.work) for i in range(_NUM_WORKERS)]
