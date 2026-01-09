#!/bin/bash

# ==============================================================================
# MySQL Master Server Backup Script
# 
# Description:
#   Backs up the 'shopping_db' database from the Master server.
#   Compresses the backup using gzip.
#   Deletes backups older than 7 days.
#
# Prerequisite:
#   Create ~/.my.cnf with MySQL credentials to avoid password prompt:
#   [client]
#   user=root
#   password=YOUR_PASSWORD
# ==============================================================================

# Configuration
BACKUP_DIR="/mnt/DATA/backups" # Set this to your desired backup location (e.g., NFS mount)
DB_NAME="shopping_db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"
RETENTION_DAYS=7
LOG_FILE="${BACKUP_DIR}/backup.log"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

echo "[$(date)] Starting backup for database: ${DB_NAME}..." >> ${LOG_FILE}

# Execute Backup
# --single-transaction: Ensures consistent backup for InnoDB without locking tables
# --quick: Retrieves rows one by one instead of retrieving the entire result set
if mysqldump --single-transaction --quick --routines --triggers ${DB_NAME} | gzip > ${BACKUP_FILE}; then
  echo "[$(date)] Backup SUCCESS: ${BACKUP_FILE}" >> ${LOG_FILE}
  
  # Delete old backups
  echo "[$(date)] Cleaning up backups older than ${RETENTION_DAYS} days..." >> ${LOG_FILE}
  find ${BACKUP_DIR} -name "${DB_NAME}_*.sql.gz" -mtime +${RETENTION_DAYS} -print -delete >> ${LOG_FILE}
  
else
  echo "[$(date)] Backup FAILED!" >> ${LOG_FILE}
  # You might want to add email alert logic here (e.g., mail -s "Backup Failed" admin@example.com)
  exit 1
fi

echo "[$(date)] Backup process completed." >> ${LOG_FILE}
echo "----------------------------------------" >> ${LOG_FILE}
